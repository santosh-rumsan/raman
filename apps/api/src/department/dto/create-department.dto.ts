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

  @ApiProperty({ example: '2024-09-06T09:50:59.336Z' })
  @IsOptional()
  deletedAt: Date;

  @IsOptional()
  @IsString()
  createdBy: string;

  @IsString()
  @IsOptional()
  updatedBy: string;
}
