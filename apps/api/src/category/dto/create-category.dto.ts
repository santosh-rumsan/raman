import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { CreateCategoryDto as dto } from '@rumsan/raman/types/category.type';

export class CreateCategoryDto implements dto {
  @IsString()
  @ApiProperty({
    description: 'Name of the category',
    example: 'Uber',
  })
  name: string;

  @IsString()
  @ApiProperty({
    description: 'Group of the category',
    example: 'Travel',
  })
  group: string;
}
