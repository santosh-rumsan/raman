import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { createId } from '@paralleldrive/cuid2';
import { paginator, PaginatorTypes, PrismaService } from '@rumsan/prisma';
import { EVENTS } from '@rumsan/raman/constants';
import { Expense, FileAttachment } from '@rumsan/raman/types';
import { InvoiceStatusType } from '@rumsan/raman/types/enums';
import { Invoice } from '@rumsan/raman/types/invoice.type';
import { tRC } from '@rumsan/sdk/types';
import { createIpfsHash } from '../utils/ipfs.utils';
import { FileAttachmentWithBuffer } from '../utils/types';
import { ReceiptReimbursementDto } from './dto/invoice-misc.dto';
import { CreateInvoiceDto } from './dto/invoice.dto';
import {
  InvoiceFilterDto,
  ListInvoiceDto,
  UpdateInvoiceDto,
} from './dto/update-invoice.dto';

const paginate: PaginatorTypes.PaginateFunction = paginator({ perPage: 100 });

@Injectable()
export class InvoiceService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async createInvoice(
    dto: CreateInvoiceDto,
    files: Express.Multer.File[],
    ctx: tRC,
  ) {
    const data: Invoice = {
      cuid: createId(),
      ...dto,
      createdBy: ctx.currentUser?.cuid,
      updatedBy: ctx.currentUser?.cuid,
    };

    const attachmentsWithBuffer: FileAttachmentWithBuffer[] = [];
    const attachments: FileAttachment[] = [];

    for (const file of files) {
      const hash = await createIpfsHash(file.buffer);
      const attachment: FileAttachment = {
        hash,
        url: 'pending',
        filename: file.originalname,
        size: file.size,
        mimeType: file.mimetype,
      };
      attachments.push(attachment);
      attachmentsWithBuffer.push({
        ...attachment,
        buffer: file.buffer,
      });
    }

    const newReceipt = await this.prisma.invoice.create({
      data: {
        ...data,
        attachments,
      },
    });

    this.eventEmitter.emit(
      EVENTS.INVOICE.CREATED,
      newReceipt,
      attachmentsWithBuffer,
      {
        clientId: ctx.clientId,
        currentUser: ctx.currentUser,
      },
    );

    return newReceipt as Invoice;
  }

  async updateInvoice(cuid: string, payload: UpdateInvoiceDto, ctx: tRC) {
    const data = { ...payload, updatedBy: ctx.currentUserId };
    this.eventEmitter.emit(EVENTS.INVOICE.UPDATED, {
      data,
    });
    return (await this.prisma.invoice.update({
      where: {
        cuid,
      },
      data,
    })) as Invoice;
  }

  async findAll(dto: ListInvoiceDto, filters?: InvoiceFilterDto) {
    const orderBy = {};
    dto.sort = dto.sort || 'date';
    dto.order = dto.order || 'desc';
    if (dto.sort) {
      orderBy[dto.sort] = dto.order;
    }

    const where = {};
    if (filters?.name) {
      where['name'] = {
        // Adjusted this to filter on the User model's name field
        name: {
          contains: filters.name,
          mode: 'insensitive',
        },
      };
    }
    if (filters?.categoryId) {
      where['categoryId'] = {
        in: filters.categoryId,
      };
    }

    if (filters?.projectId) {
      where['projectId'] = {
        in: filters.projectId,
      };
    }

    if (filters?.userId) {
      where['userId'] = {
        in: filters.userId,
      };
    }

    if (filters?.status) {
      where['status'] = {
        in: filters.status,
      };
    }

    return paginate(
      this.prisma.invoice,
      {
        where,
        orderBy,
        include: {
          Project: { select: { name: true } },
          Category: { select: { name: true } },
          User: {
            select: {
              name: true,
            },
          },
        },
      },
      { page: dto.page, perPage: dto.limit },
    );
  }

  async findOne(cuid: string, userId?: string) {
    const where = { cuid };
    if (userId) {
      where['userId'] = userId;
    }

    const result = await this.prisma.invoice.findUnique({
      where,
      include: {
        Category: {
          select: {
            name: true,
          },
        },
        Project: {
          select: {
            name: true,
            owner: true,
            Department: {
              select: {
                name: true,
                owner: true,
              },
            },
          },
        },
        Expense: {
          select: {
            cuid: true,
          },
        },
        User: {
          select: {
            name: true,
          },
        },
      },
    });
    if (!result) {
      throw new Error('Invoice not found');
    }
    return { ...result, receipts: result.attachments };
  }

  async deleteInvoice(cuid: string, ctx: tRC) {
    const result = await this.prisma.invoice.findUnique({
      where: { cuid },
    });
    if (!result) throw new Error('Invoice not found');

    const data = { cuid, updatedBy: ctx.currentUserId, deletedAt: new Date() };
    this.eventEmitter.emit(EVENTS.INVOICE.ARCHIVED, data);
    return await this.prisma.invoice.update({
      where: { cuid },
      data,
    });
  }

  private async findFirstOrThrow(cuid: string, getDeleted = false) {
    const where = { cuid };
    if (!getDeleted) {
      where['deletedAt'] = null;
    }
    return this.prisma.invoice
      .findFirstOrThrow({
        where,
      })
      .catch((error) => {
        throw new Error('Category does not exists');
      });
  }

  async reimburseInvoice(
    cuid: string,
    payload: ReceiptReimbursementDto,
    files: Express.Multer.File[],
    ctx: tRC,
  ) {
    const record = await this.findFirstOrThrow(cuid);
    let receipt = record as Invoice;
    if (receipt.status !== InvoiceStatusType.APPROVED)
      throw new Error('This invoice is not approved');
    if (!receipt.projectId)
      throw new Error('This invoice is not associated with any project');

    const project = await this.prisma.project.findUnique({
      where: { cuid: receipt.projectId },
    });

    if (!project)
      throw new Error('This invoice is not associated with any project');

    const receiptExpense = await this.prisma.$transaction(async (prisma) => {
      const {
        amount,
        projectId,
        categoryId,
        invoiceType,
        attachments,
        description,
        currency,
        vatAmount,
      } = receipt;

      const bankTransferFees = Number(payload.bankTransferFees) || 0;

      const expensePayload: Expense = {
        isVerified: true,
        verificationDetails: {
          date: new Date(),
          verifiedBy: ctx.currentUser?.cuid,
        },
        isReconciled: false,
        cuid: createId(),
        amount: payload.amount + bankTransferFees,
        projectId,
        categoryId: payload.categoryId,
        invoiceType,
        source: 'Invoice Reimbursement',
        remarks: payload.remarks,
        description,
        currency: receipt.currency,
        vatAmount,
        attachments,
        departmentId: project.departmentId,
        date: payload.date,
        accountId: payload.accountId,
        bankTransferFees,
        createdBy: ctx.currentUser?.cuid,
        updatedBy: ctx.currentUser?.cuid,
        receiptId: receipt.cuid,
      };

      const expense = (await prisma.expense.create({
        data: expensePayload,
      })) as Expense;

      receipt = (await prisma.invoice.update({
        where: { cuid },
        data: {
          status: InvoiceStatusType.REIMBURSED,
          categoryId: payload.categoryId,
          description: receipt.description,
          reimburseDetails: { ...payload, expenseId: expensePayload.cuid },
        },
      })) as Invoice;

      return { expense, receipt };
    });

    const attachmentsWithBuffer: FileAttachmentWithBuffer[] = [];
    const attachments: FileAttachment[] = [];
    for (const file of files) {
      const hash = await createIpfsHash(file.buffer);
      const attachment: FileAttachment = {
        hash,
        url: 'pending',
        filename: file.originalname,
        size: file.size,
        mimeType: file.mimetype,
      };
      attachments.push(attachment);
      attachmentsWithBuffer.push({
        ...attachment,
        buffer: file.buffer,
      });
    }
    this.eventEmitter.emit(
      EVENTS.INVOICE.REIMBURSED,
      receiptExpense,
      attachmentsWithBuffer,
      {
        clientId: ctx.clientId,
        currentUser: ctx.currentUser,
      },
    );

    return receiptExpense;
  }
}
