import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PaginatorTypes, PrismaService, paginator } from '@rumsan/prisma';
import { EVENTS } from '@rumsan/raman/constants';
import { Project } from '@rumsan/raman/types/project.type';
import { tRC } from '@rumsan/sdk/types';
import { CreateProjectDto } from './dto/create-project.dto';
import {
  ListProjectDto,
  ProjectFilterDto,
  UpdateProjectDto,
} from './dto/update-project.dto';

const paginate: PaginatorTypes.PaginateFunction = paginator({ perPage: 20 });

@Injectable()
export class ProjectService {
  constructor(
    private prisma: PrismaService,
    private eventMgr: EventEmitter2,
  ) {}

  async create(payload: CreateProjectDto, ctx: tRC) {
    const result = await this.prisma.project.findFirst({
      where: { name: payload.name },
    });
    if (result) throw new Error('Project with this name already exists');

    const data: Project = {
      ...payload,
      createdBy: ctx.currentUserId,
      updatedBy: ctx.currentUserId,
    };
    this.eventMgr.emit(EVENTS.PROJECT.CREATED, data);
    return (await this.prisma.project.create({
      data,
    })) as Project;
  }

  async findAll(dto: ListProjectDto, filters?: ProjectFilterDto) {
    const orderBy = {};
    dto.sort = dto.sort || 'createdAt';
    dto.order = dto.order || 'desc';
    if (dto.sort) {
      orderBy[dto.sort] = dto.order;
    }

    const where = {
      deletedAt: null,
    };
    if (filters?.name) {
      where['name'] = {
        contains: filters.name,
        mode: 'insensitive',
      };
    }
    if (filters?.owner) {
      where['owner'] = {
        in: filters.owner,
      };
    }

    if (filters?.departmentId) {
      where['departmentId'] = {
        in: filters.departmentId,
      };
    }

    return paginate(
      this.prisma.project,
      {
        where,
        orderBy,
        include: {
          ProjectOwner: { select: { name: true } },
          Department: { select: { name: true } },
        },
      },
      { page: dto.page, perPage: dto.limit },
    );
  }

  async findOne(cuid: string): Promise<Project> {
    return (await this.findFirstOrThrow(cuid)) as Project;
  }

  async update(cuid: string, payload: UpdateProjectDto, ctx: tRC) {
    await this.findFirstOrThrow(cuid);

    const data = { ...payload, updatedBy: ctx.currentUserId };
    this.eventMgr.emit(EVENTS.PROJECT.UPDATED, data);
    return (await this.prisma.project.update({
      where: { cuid, deletedAt: null },
      data,
    })) as Project;
  }

  async delete(cuid: string, ctx: tRC) {
    await this.findFirstOrThrow(cuid);

    const data = { updatedBy: ctx.currentUserId, deletedAt: new Date() };
    this.eventMgr.emit(EVENTS.PROJECT.ARCHIVED, {
      cuid,
      ...data,
    });

    return (await this.prisma.project.update({
      where: { cuid },
      data,
    })) as Project;
  }

  private async findFirstOrThrow(cuid: string, getDeleted = false) {
    const where = { cuid };
    if (!getDeleted) {
      where['deletedAt'] = null;
    }
    return this.prisma.project
      .findFirstOrThrow({
        where,
      })
      .catch((error) => {
        throw new Error('Category does not exists');
      });
  }
}
