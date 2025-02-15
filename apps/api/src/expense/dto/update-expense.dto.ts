import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateExpenseDto } from './create-expense.dto';

export class UpdateExpenseDto extends PartialType(CreateExpenseDto) {}

export class GetExpenseDto {
  @IsOptional()
  @ApiProperty({
    description: 'title',
  })
  title?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({ example: '10' })
  @IsNumber()
  limit?: number;
}
