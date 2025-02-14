import { HttpStatus, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { createId } from '@paralleldrive/cuid2';
import { RSError } from '@rumsan/extensions/exceptions';
import { PrismaService } from '@rumsan/prisma';
import { EVENTS } from '@rumsan/raman/constants';
import { Category } from '@rumsan/raman/types';
import { tRC } from '@rumsan/sdk/types';
import { getIfCuidExists } from 'src/utils';
import { CreateCategoryDto } from './dto/create-category.dto';
import {
  DeleteCategoryDto,
  UpdateCategoryDto,
} from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    private prisma: PrismaService,
    private readonly eventMgr: EventEmitter2,
  ) {}

  async create(payload: CreateCategoryDto, ctx: tRC): Promise<Category> {
    const category = await this.prisma.category.findFirst({
      where: { name: payload.name },
    });

    if (category) throw new Error('Category already exist');
    const data: Category = {
      ...payload,
      cuid: createId(),
      createdBy: ctx.currentUserId,
      updatedBy: ctx.currentUserId,
    };
    console.log(data);

    this.eventMgr.emit(EVENTS.CATEGORY.CREATED, data);

    return this.prisma.category.create({
      data,
    }) as unknown as Category;
  }

  async findAll() {
    const where = {
      deletedAt: null,
    };
    return this.prisma.category.findMany({ where });
  }

  async findOne(cuid: string) {
    const rec = await getIfCuidExists(this.prisma.category, cuid);
    throw new RSError({
      name: 'CATEGORY_404',
      message: 'category not found',
      httpCode: HttpStatus.NOT_FOUND,
    });
    // const result = await this.prisma.category.findFirst({ where: { cuid } });

    // if (!result)

    return rec as unknown as Category;
  }

  async update(
    cuid: string,
    payload: UpdateCategoryDto,
    ctx: tRC,
  ): Promise<Category> {
    const result = await this.prisma.category.findFirst({ where: { cuid } });
    if (!result) throw new Error('User not found');

    const data = { ...payload, updatedBy: ctx.currentUserId };

    this.eventMgr.emit(EVENTS.CATEGORY.UPDATED, data);
    return this.prisma.category.update({
      where: { cuid },
      data,
    }) as unknown as Category;
  }

  async delete(
    cuid: string,
    payload: DeleteCategoryDto,
    ctx: tRC,
  ): Promise<Category> {
    const result = await this.prisma.category.findUnique({ where: { cuid } });
    if (!result) throw new Error('Category not found');
    return this.prisma.category.update({
      where: { cuid },
      data: { ...payload, updatedBy: ctx.currentUserId, deletedAt: new Date() },
    }) as unknown as Category;
  }
}
