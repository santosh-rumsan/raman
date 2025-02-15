import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateCategoryDto } from './create-category.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
export class GetCategoryDto {
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
  perPage?: number;
}
