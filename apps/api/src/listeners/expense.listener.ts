import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EventMeta } from '@rumsan/sdk/types/event.types';

import { PrismaService } from '@rumsan/prisma';
import { EVENTS } from '@rumsan/raman/constants/events';
import { Expense } from '@rumsan/raman/types/expense.type';
import { WebSocketService } from '../app/websocket.service';
import { UploadFileToGdrive } from '../utils/file-attachment.utils';
import { GDriveService } from '../utils/gdrive.utils';

@Injectable()
export class ExpenseListener {
  private otp: string;
  private readonly logger = new Logger(ExpenseListener.name);
  constructor(
    private prisma: PrismaService,
    private gdrive: GDriveService,
    private ws: WebSocketService,
  ) {}

  @OnEvent(EVENTS.EXPENSE.UPLOAD)
  async OnExpenseUpload(
    expense: Expense,
    files: Express.Multer.File[],
    meta: EventMeta,
  ) {
    await this.addAttachmentsToExpense(
      expense.cuid,
      files,
      meta.clientId as string,
    );
  }

  async addAttachmentsToExpense(
    cuid: string,
    files: Express.Multer.File[],
    clientId: string,
  ) {
    const invoice = await this.prisma.expense.findUnique({
      where: { cuid },
      select: { attachments: true },
    });

    if (!invoice) return;

    let existingReceipts = (invoice.attachments as any[]) || [];
    if (typeof invoice.attachments === 'string') existingReceipts = [];

    let newReceipts: any[] = [];
    for (let i = 0; i < files.length; i++) {
      const gFile = await UploadFileToGdrive(files[i], this.gdrive);
      newReceipts.push(gFile);
    }

    const mergedReceipts = [...existingReceipts, ...newReceipts].reduce(
      (acc, item) => {
        if (!acc.some((att) => att.hash === item.hash)) {
          acc.push(item);
        }
        return acc;
      },
      [] as { hash: string; name: string }[],
    );

    const updatedRec = await this.prisma.expense.update({
      where: { cuid },
      data: { attachments: mergedReceipts },
    });

    if (clientId)
      this.ws.sendToClient(clientId, EVENTS.EXPENSE.UPLOAD, {
        cuid,
      });

    return updatedRec;
  }
}
