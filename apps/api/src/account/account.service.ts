import { Injectable } from '@nestjs/common';
import { CreateAccountDto, GetAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

import { EventEmitter2 } from '@nestjs/event-emitter';
import { PaginatorTypes, PrismaService, paginator } from '@rumsan/prisma';
import { EVENTS } from '@rumsan/raman/constants/events';
import { Account } from '@rumsan/raman/types/account.type';
import { tRC } from '@rumsan/sdk/types';

const paginate: PaginatorTypes.PaginateFunction = paginator({ perPage: 20 });
@Injectable()
export class AccountService {
  constructor(
    private prisma: PrismaService,
    private readonly eventMgr: EventEmitter2,
  ) {}
  async create(dto: CreateAccountDto, ctx: tRC) {
    const data = { ...dto, createdBy: ctx.currentUserId };

    this.eventMgr.emit(EVENTS.ACCOUNT.CREATED, data);
    const result = await this.prisma.account.create({
      data,
    });
    return result as Account;
  }

  async findAll(query: GetAccountDto) {
    const where: Record<any, any> = {
      deletedAt: null,
    };
    if (query.name) {
      where.name = query.name;
    }

    return paginate(
      this.prisma.account,
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
    return (await this.findFirstOrThrow(cuid)) as Account;
  }

  async update(
    cuid: string,
    updateAccountDto: UpdateAccountDto,
    ctx: tRC,
  ): Promise<Account> {
    await this.findFirstOrThrow(cuid);

    const data = { ...updateAccountDto, updatedBy: ctx.currentUserId };
    this.eventMgr.emit(EVENTS.ACCOUNT.UPDATED, data);

    return (await this.prisma.account.update({
      where: { cuid: cuid },
      data,
    })) as Account;
  }

  async delete(cuid: string, ctx: tRC) {
    await this.findFirstOrThrow(cuid);

    this.eventMgr.emit(EVENTS.ACCOUNT.ARCHIVED, {
      cuid,
      deletedAt: new Date(),
      updatedBy: ctx.currentUserId,
    });
    return this.prisma.account.update({
      where: { cuid },
      data: { deletedAt: new Date(), updatedBy: ctx.currentUserId },
    });
  }

  private async findFirstOrThrow(cuid: string, getDeleted = false) {
    const where = { cuid };
    if (!getDeleted) {
      where['deletedAt'] = null;
    }
    return this.prisma.account
      .findFirstOrThrow({
        where,
      })
      .catch((error) => {
        throw new Error('Account not found');
      });
  }
}
