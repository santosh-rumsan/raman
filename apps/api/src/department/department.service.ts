import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PaginatorTypes, PrismaService, paginator } from '@rumsan/prisma';
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
  constructor(private prisma: PrismaService) {}

  async create(createDepartmentDto: CreateDepartmentDto, ctx: tRC) {
    try {
      const department = await this.prisma.department.findUnique({
        where: { name: createDepartmentDto.name },
      });
      if (department)
        throw new HttpException(
          'Department already exist',
          HttpStatus.BAD_REQUEST,
        );
      const result = await this.prisma.department.create({
        data: {
          ...createDepartmentDto,
          createdBy: ctx.currentUserId,
          updatedBy: ctx.currentUserId,
        },
      });

      if (!result)
        throw new HttpException(
          'Department not created',
          HttpStatus.BAD_REQUEST,
        );
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
    if (!result)
      throw new HttpException('Department not found', HttpStatus.BAD_REQUEST);
    return result as Department;
  }

  async update(cuid: string, data: UpdateDepartmentDto, ctx: tRC) {
    data.updatedBy = ctx.currentUserId;
    const result = await this.prisma.department.findUnique({ where: { cuid } });
    if (!result)
      throw new HttpException('Department not found', HttpStatus.BAD_REQUEST);

    return await this.prisma.department.update({
      where: { cuid, deletedAt: null },
      data: data,
    });
  }

  async delete(
    cuid: string,
    payload: DeleteDepartmentDto,
    ctx: tRC,
  ): Promise<DeleteDepartmentDto> {
    const result = await this.prisma.department.findUnique({ where: { cuid } });
    if (!result)
      throw new HttpException('Department not found', HttpStatus.BAD_REQUEST);
    return await this.prisma.department.update({
      where: { cuid },
      data: { ...payload, updatedBy: ctx.currentUserId, deletedAt: new Date() },
    });
  }
}
