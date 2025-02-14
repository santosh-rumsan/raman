import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PaginatorTypes, PrismaService, paginator } from '@rumsan/prisma';
import { EVENTS } from '@rumsan/raman/constants';
import { Department } from '@rumsan/raman/types';
import { tRC } from '@rumsan/sdk/types';
import { CreateDepartmentDto } from './dto/create-department.dto';
import {
  DeleteDepartmentDto,
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
    const result = await this.prisma.department.findUnique({ where: { cuid } });
    if (!result) throw new Error('Department not found');
    return result as Department;
  }

  async update(cuid: string, data: UpdateDepartmentDto, ctx: tRC) {
    const result = await this.prisma.department.findUnique({ where: { cuid } });
    if (!result) throw new Error('Department not found');

    this.eventMgr.emit(EVENTS.DEPARTMENT.UPDATED, result);
    return await this.prisma.department.update({
      where: { cuid, deletedAt: null },
      data: { ...data, updatedBy: ctx.currentUserId },
    });
  }

  async delete(
    cuid: string,
    payload: DeleteDepartmentDto,
    ctx: tRC,
  ): Promise<DeleteDepartmentDto> {
    const result = await this.prisma.department.findUnique({ where: { cuid } });
    if (!result) throw new Error('Department not found');
    this.eventMgr.emit(EVENTS.DEPARTMENT.DELETED, result);
    return await this.prisma.department.update({
      where: { cuid },
      data: { ...payload, updatedBy: ctx.currentUserId, deletedAt: new Date() },
    });
  }
}
