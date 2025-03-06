import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { createId } from '@paralleldrive/cuid2';
import { PaginatorTypes, PrismaService, paginator } from '@rumsan/prisma';
import { EVENTS } from '@rumsan/raman/constants';
import { FileAttachment } from '@rumsan/raman/types';
import { Expense } from '@rumsan/raman/types/expense.type';
import { tRC } from '@rumsan/sdk/types';
import { mergeArraysByUniqueKey } from '../utils/array.utils';
import { GDriveService } from '../utils/gdrive.utils';
import { createIpfsHash } from '../utils/ipfs.utils';
import { FileAttachmentWithBuffer } from '../utils/types';
import { CreateExpenseDto } from './dto/create-expense.dto';
import {
  ExpenseFilterDto,
  ListDto,
  UpdateExpenseDto,
} from './dto/update-expense.dto';
import { ErrorManager } from './errorHandling';

const paginate: PaginatorTypes.PaginateFunction = paginator({ perPage: 20 });

@Injectable()
export class ExpenseService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
    private gdrive: GDriveService,
  ) {}

  async create(
    expenseData: CreateExpenseDto,
    files: Express.Multer.File[],
    ctx: tRC,
  ): Promise<Expense> {
    const data: Expense = {
      cuid: createId(),
      ...expenseData,
      isVerified: false,
      isReconciled: false,
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

    const newExpense = await this.prisma.$transaction(async (prisma) => {
      return prisma.expense.create({
        data: {
          ...data,
          attachments,
        },
      });
    });

    if (files.length > 0) {
      this.eventEmitter.emit(
        EVENTS.EXPENSE.UPLOAD,
        newExpense,
        attachmentsWithBuffer,
        {
          clientId: ctx.clientId,
          currentUser: ctx.currentUser,
        },
      );
    }

    this.eventEmitter.emit(EVENTS.EXPENSE.CREATED, newExpense);
    return newExpense as Expense;
  }

  async update(cuid: string, payload: UpdateExpenseDto, ctx: tRC) {
    await this.findFirstOrThrow(cuid);

    const data = {
      ...payload,
      updatedBy: ctx.currentUserId,
    };
    this.eventEmitter.emit(EVENTS.EXPENSE.UPDATED, data);

    return this.prisma.expense.update({
      where: { cuid },
      data,
    });
  }

  async addAttachments(cuid: string, files: Express.Multer.File[], ctx: tRC) {
    const expense = await this.prisma.expense.findUnique({
      where: { cuid },
    });
    if (!expense) throw new Error('Expense not found');

    const existingAttachments: FileAttachment[] =
      (expense.attachments as FileAttachment[]) || [];

    const attachmentsWithBuffer: FileAttachmentWithBuffer[] = [];
    const newAttachments: FileAttachment[] = [];

    for (const file of files) {
      const hash = await createIpfsHash(file.buffer);
      const attachment: FileAttachment = {
        hash,
        url: 'pending',
        filename: file.originalname,
        size: file.size,
        mimeType: file.mimetype,
      };
      newAttachments.push(attachment);
      attachmentsWithBuffer.push({
        ...attachment,
        buffer: file.buffer,
      });
    }

    const newRec = await this.prisma.expense.update({
      where: { cuid },
      data: {
        attachments: mergeArraysByUniqueKey(
          existingAttachments,
          newAttachments,
          'hash',
        ),
        updatedBy: ctx.currentUser ? ctx.currentUser.cuid : null,
      },
    });

    this.eventEmitter.emit(
      EVENTS.EXPENSE.UPLOAD,
      newRec,
      attachmentsWithBuffer,
      {
        clientId: ctx.clientId,
      },
    );
    return newRec;
  }

  async deleteAttachment(cuid: string, attachmentHash: string, ctx: tRC) {
    const expense = await this.prisma.expense.findUnique({
      where: { cuid },
    });
    if (!expense) throw new Error('Expense not found');

    const attachments = expense.attachments as FileAttachment[];
    const attachment = attachments.find(
      (attachment) => attachment.hash === attachmentHash,
    );
    if (!attachment) throw new Error('Attachment not found');

    if (attachment.cloudStorageId) {
      await this.gdrive.delete(attachment.cloudStorageId);
    }

    const updatedAttachments = attachments.filter(
      (attachment) => attachment.hash !== attachmentHash,
    );

    return await this.prisma.expense.update({
      where: { cuid },
      data: {
        attachments: updatedAttachments,
        updatedBy: ctx.currentUser ? ctx.currentUser.cuid : null,
      },
    });
  }

  async list(dto: ListDto, filters?: ExpenseFilterDto) {
    const orderBy = {};
    dto.sort = dto.sort || 'date';
    dto.order = dto.order || 'desc';
    if (dto.sort) {
      orderBy[dto.sort] = dto.order;
    }

    const where = {};
    if (filters?.description) {
      where['description'] = {
        contains: filters.description,
        mode: 'insensitive',
      };
    }
    if (filters?.categoryId) {
      where['categoryId'] = {
        in: filters.categoryId,
      };
    }

    if (filters?.departmentId) {
      where['departmentId'] = {
        in: filters.departmentId,
      };
    }

    if (filters?.isVerified !== undefined) {
      where['isVerified'] = filters.isVerified;
    }
    if (filters?.isReconciled !== undefined) {
      where['isReconciled'] = filters.isReconciled;
    }

    return paginate(
      this.prisma.expense,
      {
        where,
        orderBy,
        include: {
          Project: { select: { name: true } },
          Category: { select: { name: true } },
        },
      },
      { page: dto.page, perPage: dto.limit },
    );
  }

  async delete(cuid: string, ctx: tRC) {
    await this.findFirstOrThrow(cuid);
    const data = {
      cuid,
      updatedBy: ctx.currentUserId,
      deletedAt: new Date(),
    };
    this.eventEmitter.emit(EVENTS.EXPENSE.ARCHIVED, data);
    return (await this.prisma.expense.update({
      where: { cuid },
      data,
    })) as Expense;
  }

  async csvCreate(file: any[]) {
    await this.checkDuplicateValues(file);
    const errors = ErrorManager.getInstance().listError();
    ErrorManager.getInstance().removeError();

    if (errors.length) {
      throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    } else {
      try {
        const result = await this.prisma.expense.createMany({
          data: file,
        });
        return result;
      } catch (error) {
        throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  // Helper function start from here

  async checkDuplicateValues(objects: any[]) {
    const valuesSets: Set<string>[] = [];

    // Create sets for each object's values
    for (const obj of objects) {
      if (obj) {
        const valuesSet = new Set(
          Object.values(obj).map((value) => JSON.stringify(value)),
        );
        valuesSets.push(valuesSet);
      }
    }
    // Compare each set with all other sets
    for (let i = 0; i < valuesSets.length; i++) {
      for (let j = i + 1; j < valuesSets.length; j++) {
        if (await this.compareSets(valuesSets[i], valuesSets[j])) {
          ErrorManager.getInstance().addError(
            `${i + 1} and ${j + 1}`,
            `Duplicate values found `,
          );
        }
      }
    }
  }

  async compareSets(set1: Set<string>, set2: Set<string>) {
    if (set1.size !== set2.size) {
      return false;
    }
    for (const value of set1) {
      if (!set2.has(value)) {
        return false;
      }
    }
    return true;
  }

  async getSingleExpense(cuid: string) {
    return await this.prisma.expense.findUnique({
      where: { cuid },

      include: {
        Project: { select: { name: true } },
        Category: { select: { name: true } },
        Department: { select: { name: true } },
        Account: { select: { name: true } },
      },
    });
  }
  // async sendFiletoAwsPublic(payload: any): Promise<any> {
  //   const { filename, data, mimeType } = payload;
  //   const bucket = this.config.get('AWS_BUCKET');
  //   const folder = this.config.get('AWS_FOLDER');
  //   const readableStream = Readable.from(data);
  //   const upload = new Upload({
  //     client: this.s3,
  //     params: {
  //       Body: readableStream,
  //       Bucket: bucket,
  //       Key: `${folder}/${filename}`,
  //       Tagging: folder,
  //       ACL: 'public-read',
  //       ContentType: mimeType,
  //     },
  //   });

  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       const data = await upload.done();
  //       resolve(data);
  //     } catch (error) {
  //       reject(error);
  //     }
  //   });
  // }

  private async findFirstOrThrow(cuid: string, getDeleted = false) {
    const where = { cuid };
    if (!getDeleted) {
      where['deletedAt'] = null;
    }
    return this.prisma.expense
      .findFirstOrThrow({
        where,
      })
      .catch((error) => {
        throw new Error('Category does not exists');
      });
  }

  async verifyExpense(cuid: string, verifiedBy: string) {
    const expense = await this.prisma.expense.findUnique({
      where: { cuid },
    });

    if (!expense) {
      throw new Error('Expense not found');
    }

    return this.prisma.expense.update({
      where: { cuid },
      data: {
        isVerified: true,
        verificationDetails: {
          approvedAt: new Date(),
          verifiedBy,
        },
      },
    });
  }
}
