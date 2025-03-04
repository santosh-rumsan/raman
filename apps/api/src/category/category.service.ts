import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { createId } from '@paralleldrive/cuid2';
import { paginator, PaginatorTypes, PrismaService } from '@rumsan/prisma';
import { EVENTS } from '@rumsan/raman/constants/events';
import { Category } from '@rumsan/raman/types/category.type';
import { tRC } from '@rumsan/sdk/types';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryFilterDto, ListCategoryDto, UpdateCategoryDto } from './dto/update-category.dto';


const paginate: PaginatorTypes.PaginateFunction = paginator({ perPage: 20 });

@Injectable()
export class CategoryService {
  constructor(
    private prisma: PrismaService,
    private readonly eventMgr: EventEmitter2,
  ) { }

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
    this.eventMgr.emit(EVENTS.CATEGORY.CREATED, data);

    return this.prisma.category.create({
      data,
    }) as unknown as Category;
  }

  async findAll(dto: ListCategoryDto, filters?: CategoryFilterDto) {
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

    if (filters?.group) {
      where['group'] = {
        in: filters.group,

      };
    }

    return paginate(
      this.prisma.category,
      {
        where,
        orderBy,

      },
      { page: dto.page, perPage: dto.limit },

    );
  }

  async findOne(cuid: string) {
    return this.findFirstOrThrow(cuid) as unknown as Category;
  }

  async update(
    cuid: string,
    payload: UpdateCategoryDto,
    ctx: tRC,
  ): Promise<Category> {
    await this.findFirstOrThrow(cuid);
    const data = { ...payload, updatedBy: ctx.currentUserId };

    this.eventMgr.emit(EVENTS.CATEGORY.UPDATED, data);
    return this.prisma.category.update({
      where: { cuid },
      data,
    }) as unknown as Category;
  }

  async delete(cuid: string, ctx: tRC): Promise<Category> {
    await this.findFirstOrThrow(cuid);

    const data = { updatedBy: ctx.currentUserId, deletedAt: new Date() };
    this.eventMgr.emit(EVENTS.CATEGORY.ARCHIVED, {
      cuid,
      ...data,
    });

    return this.prisma.category.update({
      where: { cuid },
      data,
    }) as unknown as Category;
  }

  private async findFirstOrThrow(cuid: string, getDeleted = false) {
    const where = { cuid };
    if (!getDeleted) {
      where['deletedAt'] = null;
    }
    return this.prisma.category
      .findFirstOrThrow({
        where,
      })
      .catch((error) => {
        throw new Error('Category does not exists');
      });
  }
}
