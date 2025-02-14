import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { CreateDepartment } from '@rumsan/raman/types/department.type';

export class CreateDepartmentDto implements CreateDepartment {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Name of the Department',
    example: 'Rahat',
  })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Department Group',
    example: 'shared',
  })
  group: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Department Owner',
    example: 'xxxxx',
  })
  owner: string;
}
