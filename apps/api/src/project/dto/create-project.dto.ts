import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { CreateProject } from '@rumsan/raman/types/project.type';

export class CreateProjectDto implements CreateProject {
  @IsString()
  @ApiProperty({
    description: 'Name of the Project',
    example: 'Project',
  })
  name: string;

  @IsString()
  @ApiProperty({
    description: 'Department Id of the User',
    example: '2131ddw3a',
    type: String,
  })
  departmentId: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Project owner',
    example: '2131ddw3a',
    type: String,
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
