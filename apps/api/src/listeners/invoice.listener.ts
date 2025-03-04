import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';

import { PrismaService } from '@rumsan/prisma';
import { EVENTS } from '@rumsan/raman/constants/events';
import { Invoice } from '@rumsan/raman/types/invoice.type';
import { EmailInvoiceApproval } from '../email/invoice-approval.email';
import { GDriveService } from '../utils/gdrive.utils';

@Injectable()
export class InvoiceListener {
  private otp: string;
  private readonly logger = new Logger(InvoiceListener.name);
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
    private gdrive: GDriveService,
    private email: EmailInvoiceApproval,
  ) {}

  @OnEvent(EVENTS.INVOICE.CREATED)
  async OnInvoiceCreation(data: Invoice, files: Express.Multer.File[]) {
    await this.addAttachmentsToInvoice(data.cuid, files);
    this.email.send(data.cuid);
  }

  async addAttachmentsToInvoice(cuid: string, files: Express.Multer.File[]) {
    // const invoice = await this.prisma.invoice.findUnique({
    //   where: { cuid },
    //   select: { receipts: true },
    // });
    // if (!invoice) return;
    // let existingReceipts = (invoice.receipts as any[]) || [];
    // if (typeof invoice.receipts === 'string') existingReceipts = [];
    // let newReceipts: any[] = [];
    // for (let i = 0; i < files.length; i++) {
    //   const gFile = await UploadFileToGdrive(files[i], this.gdrive);
    //   newReceipts.push(gFile);
    // }
    // const mergedReceipts = [...existingReceipts, ...newReceipts].reduce(
    //   (acc, item) => {
    //     if (!acc.some((att) => att.hash === item.hash)) {
    //       acc.push(item);
    //     }
    //     return acc;
    //   },
    //   [] as { hash: string; name: string }[],
    // );
    // return this.prisma.invoice.update({
    //   where: { cuid },
    //   data: { receipts: mergedReceipts },
    // });
  }
}
