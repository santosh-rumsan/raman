import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { paginator, PaginatorTypes, PrismaService } from '@rumsan/prisma';
import { tRC } from '@rumsan/sdk/types';
import { CreateMyInvoiceDto } from './dto/invoice.dto';
import { ListInvoiceDto } from './dto/update-invoice.dto';
import { InvoiceService } from './invoice.service';
const paginate: PaginatorTypes.PaginateFunction = paginator({ perPage: 20 });

@Injectable()
export class MyInvoiceService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
    private invoiceService: InvoiceService,
  ) {}

  async createInvoice(
    dto: CreateMyInvoiceDto,
    files: Express.Multer.File[],
    ctx: tRC,
  ) {
    const userId = ctx.currentUser?.cuid as string;
    return this.invoiceService.createInvoice({...dto, userId}, files, ctx);
  }

  async findMyInvoice(query: ListInvoiceDto, ctx: tRC) {
    if(!ctx.currentUser?.cuid) {
      throw new Error('User not found');
    }
    const filters = { userId: [ctx.currentUser?.cuid] }
    return this.invoiceService.findAll(query, filters);
  }

  async findOne(cuid: string, ctx: tRC) {
    return this.invoiceService.findOne(cuid, ctx?.currentUser?.cuid);
  }
}
