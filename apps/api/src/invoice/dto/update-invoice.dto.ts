import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateInvoiceDto } from './invoice.dto';

export class UpdateInvoiceDto extends PartialType(CreateInvoiceDto) {}

export class ListInvoiceDto {
  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({ example: '10' })
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsString()
  sort?: string;

  @IsOptional()
  @IsString()
  order?: 'asc' | 'desc' = 'desc';
}
export class InvoiceFilterDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsString({ each: true })
  categoryId?: string[];

  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsString({ each: true })
  projectId?: string[];

  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsString({ each: true })
  userId?: string[];

  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  status?: string[];
}
