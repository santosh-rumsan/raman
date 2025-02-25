import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { CreateInvoiceDto } from './invoice.dto';

export class UpdateInvoiceDto extends PartialType(CreateInvoiceDto) { }

export class GetInvoiceDto {
  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({ example: '10' })
  @IsNumber()
  limit?: number;
}
