import { OmitType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import {
  Currency,
  InvoiceStatusType,
  InvoiceType,
} from '@rumsan/raman/types/enums';
import { CreateInvoice } from '@rumsan/raman/types/invoice.type';

import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
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
    description: 'User ID',
    example: 'cm4cx64px0002qp1mh85t02f0',
  })
  userId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Additional Info',
    example: 'From Sanepa to Naxal',
  })
  description: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Bill Type',
    example: 'pan/vat/estimate',
  })
  @IsEnum(InvoiceType)
  invoiceType: InvoiceType;

  @IsInt()
  @IsOptional()
  @ApiProperty({
    description: 'Vat Amount',
    example: '100.01',
  })
  vatAmount: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Invoice rejected',
    type: String,
  })
  reason: string;

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

  @IsDate()
  @IsOptional()
  @ApiProperty({
    description: 'Reimbursed Date',
    example: '25-11-2024',
  })
  reimbursedDate: Date;

  @IsOptional()
  @IsBoolean()
  isApproved: boolean;

  @IsOptional()
  @IsString()
  approvalChallenge: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Remarks',
    example: 'Testing Remarks',
  })
  reimbursedRemarks: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Expense ID',
    example: 'sssssssss',
  })
  expenseId: string;

  @IsString()
  @IsOptional()
  accountId: string;
}

export class CreateInvoiceForInvoiceAppDto extends OmitType(CreateInvoiceDto, [
  'userId',
] as const) {}

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
