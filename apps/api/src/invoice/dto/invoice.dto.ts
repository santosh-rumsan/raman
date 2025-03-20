import { OmitType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import {
  Currency,
  InvoiceStatusType,
  InvoiceType,
} from '@rumsan/raman/types/enums';
import { CreateInvoice } from '@rumsan/raman/types/invoice.type';

import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';

export class CreateInvoiceDto implements CreateInvoice {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Amount in Receipt',
    example: '100.01',
  })
  amount: number;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Currency of the Expense',
    example: Currency.NPR,
  })
  currency: Currency;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'User ID',
    example: 'cm4cx64px0002qp1mh85t02f0',
  })
  userId: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Project ID',
    example: 'cm4cxce8m0001h1ngsrbcgu4m',
  })
  projectId?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Category ID',
    example: 'cm4cx64qk0005qp1mc7tak2io',
  })
  categoryId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Additional Info',
    example: 'From Sanepa to Naxal',
  })
  description: string;

  @IsNotEmpty()
  @IsEnum(InvoiceType, {
    message: `invoiceType must be one of ${Object.values(InvoiceType).join(', ')}`,
  })
  @ApiProperty({
    example: 'ESTIMATE',
  })
  invoiceType: InvoiceType;

  @ValidateIf((obj) => obj.invoiceType === InvoiceType.VAT)
  @IsNumber()
  @Min(0.001, {
    message: 'VAT amount must be greater than 0 if invoiceType is VAT',
  })
  @ApiProperty({
    example: 23,
  })
  vatAmount?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Status Type',
    example: 'pending/verified',
  })
  @IsEnum(InvoiceStatusType)
  status: InvoiceStatusType;

  @IsDate()
  @IsOptional()
  @ApiProperty({
    description: 'Reimbursed Date',
    example: '29-11-2024',
  })
  date: Date;

  @IsString()
  @IsOptional()
  accountId: string;
}

export class CreateMyInvoiceDto extends OmitType(CreateInvoiceDto, [
  'userId',
]) {}

export class InvoiceListParamsDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Page Number',
    example: '1',
    required: false,
  })
  page?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Number of Invoices to fetch at a time',
    example: '10',
    required: false,
  })
  perPage?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Search By Name',
    required: false,
  })
  name?: string;

  @IsString()
  @IsOptional()
  orderby?: string;

  @IsString()
  @IsOptional()
  order?: string;

  @IsString()
  @IsOptional()
  startDate?: string;

  @IsString()
  @IsOptional()
  endDate?: string;
}
