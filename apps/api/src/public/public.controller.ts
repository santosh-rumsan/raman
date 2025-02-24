import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  InvoiceApprovalDto,
  InvoiceRejectionDto,
} from '../invoice/dto/invoice-approval.dto';
import { PublicService } from './public.service';

@Controller('public')
@ApiTags('public')
export class PublicController {
  constructor(private readonly approvalService: PublicService) {}

  @Get('category')
  getAllCategories() {
    return this.approvalService.findAll();
  }

  @Get('invoices/:approvalChallenge')
  getInvoicesByChallange(
    @Param('approvalChallenge') approvalChallenge: string,
  ) {
    return this.approvalService.getInvoicesByChallange(approvalChallenge);
  }

  @Patch('invoices/:approvalChallenge/reject')
  reject(
    @Param('approvalChallenge') approvalChallenge: string,
    @Body() dto: InvoiceRejectionDto,
  ) {
    return this.approvalService.rejectInvoice(approvalChallenge, dto);
  }

  @Patch('invoices/:approvalChallenge/approve')
  approve(
    @Param('approvalChallenge') approvalChallenge: string,
    @Body() dto: InvoiceApprovalDto,
  ) {
    return this.approvalService.approveInvoice(approvalChallenge, dto);
  }
}
