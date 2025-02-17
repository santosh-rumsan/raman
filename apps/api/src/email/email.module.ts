import { Module } from '@nestjs/common';
import { PrismaService } from '@rumsan/prisma';
import { EmailInvoiceApproval } from './invoice-approval.email';
import { EmailOTP } from './otp.email';

@Module({
  providers: [EmailInvoiceApproval, EmailOTP, PrismaService],
  exports: [EmailInvoiceApproval, EmailOTP],
})
export class EmailModule {}
