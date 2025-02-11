import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RSError } from '@rumsan/extensions/exceptions';
import { PrismaService } from '@rumsan/prisma';
import { Category } from '@rumsan/raman/types';
import { tRC } from '@rumsan/sdk/types';
import { CreateCategoryDto } from './dto/create-category.dto';
import {
  DeleteCategoryDto,
  UpdateCategoryDto,
} from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(payload: CreateCategoryDto, ctx: tRC): Promise<Category> {
    const category = await this.prisma.category.findFirst({
      where: { name: payload.name },
    });

    if (category)
      throw new HttpException('Category already exist', HttpStatus.BAD_REQUEST);

    return this.prisma.category.create({
      data: {
        ...payload,
        createdBy: ctx.currentUserId,
        updatedBy: ctx.currentUserId,
      },
    }) as unknown as Category;
  }

  async findAll() {
    const where = {
      deletedAt: null,
    };
    return this.prisma.category.findMany({ where });
  }

  async findOne(cuid: string): Promise<Category> {
    const result = await this.prisma.category.findUnique({ where: { cuid } });

    if (!result)
      throw new RSError({
        name: 'CATEGORY_404',
        message: 'category not found',
        httpCode: HttpStatus.NOT_FOUND,
      });
    return result as unknown as Category;
  }

  async update(
    cuid: string,
    payload: UpdateCategoryDto,
    ctx: tRC,
  ): Promise<Category> {
    const result = await this.prisma.category.findUnique({ where: { cuid } });
    if (!result)
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    return this.prisma.category.update({
      where: { cuid },
      data: { ...payload, updatedBy: ctx.currentUserId },
    }) as unknown as Category;
  }

  async delete(
    cuid: string,
    payload: DeleteCategoryDto,
    ctx: tRC,
  ): Promise<Category> {
    const result = await this.prisma.category.findUnique({ where: { cuid } });
    if (!result)
      throw new HttpException('Category not found', HttpStatus.BAD_REQUEST);
    return this.prisma.category.update({
      where: { cuid },
      data: { ...payload, updatedBy: ctx.currentUserId, deletedAt: new Date() },
    }) as unknown as Category;
  }
}
