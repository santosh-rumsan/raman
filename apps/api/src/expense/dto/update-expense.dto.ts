import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateExpenseDto } from './create-expense.dto';

export class UpdateExpenseDto extends PartialType(CreateExpenseDto) {}

export class ListDto {
  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  page?: number = 1;

  @ApiPropertyOptional({ example: '10' })
  @IsNumber()
  limit?: number = 100;

  @IsOptional()
  @IsString()
  sort?: string;

  @IsOptional()
  @IsString()
  order?: 'asc' | 'desc' = 'desc';
}

export class ExpenseFilterDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsString({ each: true })
  categoryId?: string[];

  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsString({ each: true })
  departmentId?: string[];

  @IsOptional()
  isApproved?: boolean | string[];

  @IsOptional()
  isReconciled?: boolean | string[];
}
