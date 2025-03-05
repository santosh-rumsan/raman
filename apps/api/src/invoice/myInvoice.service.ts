import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { createId } from '@paralleldrive/cuid2';
import { paginator, PaginatorTypes, PrismaService } from '@rumsan/prisma';
import { EVENTS } from '@rumsan/raman/constants/events';
import { Invoice } from '@rumsan/raman/types/invoice.type';
import { tRC } from '@rumsan/sdk/types';
import { CreateInvoiceForInvoiceAppDto } from './dto/invoice.dto';
import { ListInvoiceDto } from './dto/update-invoice.dto';
const paginate: PaginatorTypes.PaginateFunction = paginator({ perPage: 20 });

@Injectable()
export class MyInvoiceService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) { }

  async createInvoice(
    dto: CreateInvoiceForInvoiceAppDto,
    files: Express.Multer.File[],
    ctx: tRC,
  ) {
    const userId = ctx.currentUser?.cuid as string;
    const invoice = {
      cuid: createId(),
      ...dto,
      date: new Date(Date.now()),
      userId,
      createdBy: userId,
      updatedBy: userId,
    };

    let images: any = null;
    if (files.length > 0) {
      images = 'pending';
    }

    const myInvoice = await this.prisma.$transaction(async (prisma) => {
      return prisma.invoice.create({
        data: {
          ...invoice,
          receipts: images,
        },
      });
    });

    if (files.length > 0) {
      this.eventEmitter.emit(EVENTS.INVOICE.CREATED, {
        cuid: invoice.cuid,
        files: files,
      });
    }

    return myInvoice as Invoice;
  }

  async findMyInvoice(query: ListInvoiceDto, ctx: tRC) {
    const where: Record<any, any> = {
      deletedAt: null,
      userId: ctx.currentUser?.cuid,
    };

    return paginate(
      this.prisma.invoice,
      {
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
            },
          },
        },
      },

      {
        page: query.page,
        perPage: query.limit,
      },
    );
  }

  async findOne(cuid: string) {
    const result = await this.prisma.invoice.findUnique({
      where: { cuid },
      include: {
        Category: {
          select: {
            name: true,
          },
        },
        Project: {
          select: {
            name: true,
            Department: {
              select: {
                name: true,
              },
            },
          },
        },
        Expense: {
          select: {
            Account: {
              select: {
                name: true,
              },
            },
          },
        },
        User: true,
      },
    });
    if (!result) {
      throw new Error('Invoice not found');
    }
    return result;
  }
}
