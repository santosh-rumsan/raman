import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateDepartmentDto } from './create-department.dto';

export class UpdateDepartmentDto extends PartialType(CreateDepartmentDto) {}

export class GetDepartmentDto {
  @IsOptional()
  @ApiProperty({
    description: 'name',
  })
  name?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({ example: '10' })
  @IsNumber()
  limit?: number;
}
