import {
  ApiProperty,
  ApiPropertyOptional,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateCategoryDto } from './create-category.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}

export class DeleteCategoryDto extends PickType(CreateCategoryDto, []) {}

// export class getCategoryDto extends PickType(CreateCategoryDto, ['name']) {}
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
