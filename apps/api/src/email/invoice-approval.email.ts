import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PrismaService } from '@rumsan/prisma';
import {
  loadTemplateAndReplacePlaceholders,
  sendEmail,
} from '../utils/emails.utils';

@Injectable()
export class EmailInvoiceApproval {
  private readonly logger = new Logger(EmailInvoiceApproval.name);
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {}

  async send(cuid: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { cuid },
      include: {
        Category: true,
        User: true,
        Project: {
          include: {
            ProjectOwner: {
              include: {
                User: true,
              },
            },
          },
        },
      },
    });

    if (!invoice) return;
    if (!invoice.Project?.ProjectOwner) {
      this.logger.log('Project Owner not found');
    }

    const recipientEmail = invoice.Project?.ProjectOwner?.User.email; // Replace with actual recipient
    if (!recipientEmail) return;

    const dateObj = new Date(invoice.date);
    const date = dateObj.toDateString();

    const APP_URL = this.config.get('APP_URL');

    const { text, html } = loadTemplateAndReplacePlaceholders(
      `${__dirname}/../assets/email-templates/invoice-approval.html`,
      {
        fullName: invoice.Project?.ProjectOwner?.name,
        requestor: invoice.User?.name,
        amount: invoice.amount,
        currency: invoice.currency,
        category: invoice.Category?.name,
        publicUrl: `${APP_URL}/public`,
        challenge: invoice.approvalChallenge,
        date,
        invoiceId: invoice.cuid,
        project: invoice.Project?.name,
      },
    );

    sendEmail({
      address: recipientEmail,
      subject: `Rumsan: Invoice Approval Request`,
      text,
      html,
    })
      .then(() => this.logger.log(`Invoice approval sent to ${recipientEmail}`))
      .catch((e) => this.logger.error(`sendApprovalEmail: ${e}`));
  }
}
