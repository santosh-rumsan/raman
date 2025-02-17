import { Module } from '@nestjs/common';
import { PrismaService } from '@rumsan/prisma';
import { GDriveService } from '../utils/gdrive.utils';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { MyInvoiceController } from './myInvoice.controller';
import { MyInvoiceService } from './myInvoice.service';

@Module({
  imports: [],
  controllers: [InvoiceController, MyInvoiceController],
  providers: [InvoiceService, MyInvoiceService, GDriveService, PrismaService],
  exports: [InvoiceService, MyInvoiceService],
})
export class InvoiceModule {}
