import {
  ApiPropertyOptional,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateProjectDto } from './create-project.dto';

export class UpdateProjectDto extends PartialType(CreateProjectDto) { }

export class DeleteProjectDto extends PickType(CreateProjectDto, []) { }

export class ListProjectDto {
  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({ example: '10' })
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsString()
  sort?: string;

  @IsOptional()
  @IsString()
  order?: 'asc' | 'desc' = 'desc';
}

export class ProjectFilterDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsString({ each: true })
  owner?: string[];

  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsString({ each: true })
  departmentId?: string[];
}
