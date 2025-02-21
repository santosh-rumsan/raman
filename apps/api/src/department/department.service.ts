import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PaginatorTypes, PrismaService, paginator } from '@rumsan/prisma';
import { EVENTS } from '@rumsan/raman/constants/events';
import { Department } from '@rumsan/raman/types/department.type';
import { tRC } from '@rumsan/sdk/types';
import { CreateDepartmentDto } from './dto/create-department.dto';
import {
  GetDepartmentDto,
  UpdateDepartmentDto,
} from './dto/update-department.dto';

const paginate: PaginatorTypes.PaginateFunction = paginator({ perPage: 20 });

@Injectable()
export class DepartmentService {
  constructor(
    private prisma: PrismaService,
    private readonly eventMgr: EventEmitter2,
  ) {}

  async create(createDepartmentDto: CreateDepartmentDto, ctx: tRC) {
    try {
      const department = await this.prisma.department.findUnique({
        where: { name: createDepartmentDto.name },
      });
      if (department) throw new Error('Department already exist');
      const result = await this.prisma.department.create({
        data: {
          ...createDepartmentDto,
          createdBy: ctx.currentUserId,
          updatedBy: ctx.currentUserId,
        },
      });

      if (!result) throw new Error('Department not created');
      this.eventMgr.emit(EVENTS.DEPARTMENT.CREATED, result);
      return result as Department;
    } catch (error) {
      console.log(error?.message);
      throw error?.message;
    }
  }

  async findAll(query: GetDepartmentDto) {
    const where: Record<any, any> = {
      deletedAt: null,
    };
    if (query.name) {
      where.name = query.name;
    }

    return paginate(
      this.prisma.department,
      {
        where,
      },
      {
        page: query.page,
        perPage: query.limit,
      },
    );
  }

  async findOne(cuid: string) {
    return (await this.findFirstOrThrow(cuid)) as Department;
  }

  async update(cuid: string, dto: UpdateDepartmentDto, ctx: tRC) {
    await this.findFirstOrThrow(cuid);

    const data = { ...dto, updatedBy: ctx.currentUserId };
    this.eventMgr.emit(EVENTS.DEPARTMENT.UPDATED, data);

    return (await this.prisma.department.update({
      where: { cuid, deletedAt: null },
      data,
    })) as Department;
  }

  async delete(cuid: string, ctx: tRC) {
    await this.findFirstOrThrow(cuid);

    const data = { updatedBy: ctx.currentUserId, deletedAt: new Date() };
    this.eventMgr.emit(EVENTS.DEPARTMENT.ARCHIVED, { ...data, cuid });
    return (await this.prisma.department.update({
      where: { cuid },
      data,
    })) as Department;
  }

  private async findFirstOrThrow(cuid: string, getDeleted = false) {
    const where = { cuid };
    if (!getDeleted) {
      where['deletedAt'] = null;
    }
    return this.prisma.department
      .findFirstOrThrow({
        where,
      })
      .catch((error) => {
        throw new Error('Category does not exists');
      });
  }
}
