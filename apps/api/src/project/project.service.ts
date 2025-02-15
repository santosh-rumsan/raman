import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PaginatorTypes, PrismaService, paginator } from '@rumsan/prisma';
import { EVENTS } from '@rumsan/raman/constants';
import { Project } from '@rumsan/raman/types';
import { tRC } from '@rumsan/sdk/types';
import { CreateProjectDto } from './dto/create-project.dto';
import { GetProjectDto, UpdateProjectDto } from './dto/update-project.dto';

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
