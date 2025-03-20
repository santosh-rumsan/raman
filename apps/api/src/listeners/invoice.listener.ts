import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';

import { PrismaService } from '@rumsan/prisma';
import { EVENTS } from '@rumsan/raman/constants';
import { FileAttachment } from '@rumsan/raman/types';
import { Invoice } from '@rumsan/raman/types/invoice.type';
import { EventMeta } from '@rumsan/sdk/types/event.types';
import { WebSocketService } from '../app/websocket.service';
import { EmailInvoiceApproval } from '../email/invoice-approval.email';
import { mergeArraysByUniqueKey } from '../utils/array.utils';
import { UploadFileToGdrive } from '../utils/file-attachment.utils';
import { GDriveService } from '../utils/gdrive.utils';
import { FileAttachmentWithBuffer } from '../utils/types';

@Injectable()
export class InvoiceListener {
  private otp: string;
  private readonly logger = new Logger(InvoiceListener.name);
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
    private gdrive: GDriveService,
    private email: EmailInvoiceApproval,
    private ws: WebSocketService,
  ) {}

  @OnEvent(EVENTS.INVOICE.CREATED)
  async OnInvoiceCreation(
    receipt: Invoice,
    attachments: FileAttachmentWithBuffer[],
    meta: EventMeta,
  ) {
    if (!receipt) return;

    for (const attachment of attachments) {
      await this.uploadAttachment(receipt, attachment, meta?.clientId);
    }

    this.email.send(receipt.cuid);
  }

  async uploadAttachment(
    receipt: Invoice,
    attachment: FileAttachmentWithBuffer,
    clientId?: string,
  ) {
    if (!receipt) return;

    const existingAttachments: FileAttachment[] =
      (receipt.attachments as FileAttachment[]) || [];

    const { file } = await UploadFileToGdrive(attachment, this.gdrive);

    const updatedRec = await this.prisma.invoice.update({
      where: { cuid: receipt.cuid },
      data: {
        attachments: mergeArraysByUniqueKey(
          existingAttachments,
          [file],
          'hash',
        ),
      },
    });

    if (clientId) {
      this.ws.sendToClient(clientId, EVENTS.INVOICE.UPLOAD, {
        cuid: updatedRec.cuid,
      });
    }
  }
}
