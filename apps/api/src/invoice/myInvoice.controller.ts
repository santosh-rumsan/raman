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
import { CreateInvoiceForInvoiceAppDto } from './dto/invoice.dto';
import { GetInvoiceDto } from './dto/update-invoice.dto';

import { APP } from '@rumsan/raman/constants';
import { JwtGuard } from '@rumsan/user';
import { MyInvoiceService } from './myInvoice.service';

@Controller('me/invoices')
@ApiTags('me/invoices')
@ApiBearerAuth(APP.JWT_BEARER)
@UseGuards(JwtGuard)
export class MyInvoiceController {
  constructor(private readonly invoiceService: MyInvoiceService) {}

  @Post()
  //@CheckAbilities({ actions: ACTIONS.CREATE, subject: SUBJECTS.INVOICE })
  @ApiConsumes('multipart/form-data')
  @InvoiceFile()
  @UseInterceptors(FilesInterceptor('receipts'))
  async createInvoice(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() dto: CreateInvoiceForInvoiceAppDto,
    @xRC() rc: tRC,
  ) {
    const res = await this.invoiceService.createInvoice(dto, files, rc);
    return res;
  }

  @Get()
  //@CheckAbilities({ actions: ACTIONS.READ, subject: SUBJECTS.INVOICE })
  getMyInvoice(@Query() query: GetInvoiceDto, @xRC() rc: tRC): any {
    return this.invoiceService.findMyInvoice(query, rc);
  }

  @Get(':invoiceId')
  //@CheckAbilities({ actions: ACTIONS.READ, subject: SUBJECTS.INVOICE })
  getOneInvoice(@Param('invoiceId') invoiceId: string) {
    return this.invoiceService.findOne(invoiceId);
  }
}
