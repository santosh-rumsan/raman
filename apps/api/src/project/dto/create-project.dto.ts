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
}
