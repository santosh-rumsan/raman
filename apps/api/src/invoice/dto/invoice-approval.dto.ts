import { PickType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateInvoiceDto } from './invoice.dto';

export class InvoiceRejectionDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Reason for rejection',
    example: 'It is just rejected',
    required: false,
  })
  reason: string;
}

export class InvoiceApprovalDto extends PickType(CreateInvoiceDto, [
  'categoryId',
  'description',
]) {}
