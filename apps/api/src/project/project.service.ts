import { Injectable } from '@nestjs/common';
import { PaginatorTypes, PrismaService, paginator } from '@rumsan/prisma';
import { Project } from '@rumsan/raman/types';
import { tRC } from '@rumsan/sdk/types';
import { CreateProjectDto } from './dto/create-project.dto';
import {
  DeleteProjectDto,
  GetProjectDto,
  UpdateProjectDto,
} from './dto/update-project.dto';

const paginate: PaginatorTypes.PaginateFunction = paginator({ perPage: 20 });

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  async create(payload: CreateProjectDto, ctx: tRC): Promise<Project> {
    const result = await this.prisma.project.findUnique({
      where: { name: payload.name },
    });
    if (result) throw new Error('Project with this name already exists');
    return this.prisma.project.create({
      data: {
        ...payload,
        createdBy: ctx.currentUserId,
      },
    }) as unknown as Project;
  }

  async findAll(query: GetProjectDto) {
    const where: Record<any, any> = {
      deletedAt: null,
    };
    if (query.name) {
      where.name = query.name;
    }

    return paginate(
      this.prisma.project,
      {
        where,
      },
      {
        page: query.page,
        perPage: query.limit,
      },
    );
  }

  async findOne(cuid: string): Promise<Project> {
    const result = await this.prisma.project.findUnique({
      where: { cuid },
      include: { ProjectOwner: true },
    });

    if (!result) throw new Error('Project not found');
    return result as Project;
  }

  async update(
    cuid: string,
    data: UpdateProjectDto,
    ctx: tRC,
  ): Promise<Project> {
    const result = await this.prisma.project.findUnique({ where: { cuid } });
    if (!result) throw new Error('Project not found');
    return this.prisma.project.update({
      where: { cuid, deletedAt: null },
      data: { ...data, updatedBy: ctx.currentUserId },
    }) as unknown as Project;
  }

  async delete(
    cuid: string,
    payload: DeleteProjectDto,
    ctx: tRC,
  ): Promise<Project> {
    const result = await this.prisma.project.findUnique({ where: { cuid } });
    if (!result) throw new Error('Project not found');

    return this.prisma.project.update({
      where: { cuid },
      data: {
        ...payload,
        updatedBy: ctx.currentUserId,
        deletedAt: new Date(),
      },
    }) as unknown as Project;
  }
}
