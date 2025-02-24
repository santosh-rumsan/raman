import { ApiProperty } from '@nestjs/swagger';
import { InvoiceStatusType, InvoiceType } from '@rumsan/raman/types';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePublicDto {
  @IsNumber()
  @ApiProperty({
    description: 'Amount in Receipt',
    example: '100.01',
  })
  amount: number;

  @IsString()
  @ApiProperty({
    description: 'Project ID',
    example: 'sssssssss',
  })
  projectId: string;

  @IsString()
  @ApiProperty({
    description: 'Category ID',
    example: 'ssssssssss',
  })
  categoryId: string;

  @IsString()
  @ApiProperty({
    description: 'User ID',
    example: 'ssssssssss',
  })
  userId: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Additional Info',
    example: 'From Sanepa to Naxal',
  })
  description?: string;

  @IsString()
  @ApiProperty({
    description: 'Bill Type',
    example: 'pan/vat/estimate',
  })
  @IsEnum(InvoiceType)
  invoiceType: InvoiceType;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Vat Amount',
    example: '100.01',
  })
  vatAmount: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'aws hash of the receipt',
    example: ['****'],
    type: String,
  })
  receipts: string[];

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

  @ApiProperty({ example: '2024-09-06T09:50:59.336Z' })
  @IsOptional()
  deletedAt: Date;

  @IsOptional()
  @IsString()
  createdBy: string;

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
  updatedBy: string;

  @IsBoolean()
  @IsOptional()
  rejectOrApprove: boolean;
}
