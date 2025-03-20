import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { xRC } from '@rumsan/extensions/decorators';
import { tRC } from '@rumsan/sdk/types';

import { InvoiceFile } from '../decorator/invoiceBody';
import { ListInvoiceDto } from './dto/update-invoice.dto';

import { APP } from '@rumsan/raman/constants';
import { JwtGuard } from '@rumsan/user';
import { CreateMyInvoiceDto } from './dto/invoice.dto';
import { MyInvoiceService } from './myInvoice.service';

@Controller('me/invoices')
@ApiTags('me/invoices')
@ApiBearerAuth(APP.JWT_BEARER)
@UseGuards(JwtGuard)
export class MyInvoiceController {
  constructor(private readonly invoiceService: MyInvoiceService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @InvoiceFile()
  @UseInterceptors(FilesInterceptor('receipts'))
  async createInvoice(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() dto: CreateMyInvoiceDto,
    @xRC() rc: tRC,
  ) {
    const res = await this.invoiceService.createInvoice(dto, files, rc);
    return res;
  }

  @Get()
  getMyInvoices(@Query() query: ListInvoiceDto, @xRC() rc: tRC): any {
    return this.invoiceService.findMyInvoice(query, rc);
  }

  @Get(':invoiceId')
  getOneInvoice(@Param('invoiceId') invoiceId: string, @xRC() rc: tRC) {
    return this.invoiceService.findOne(invoiceId, rc);
  }
}
