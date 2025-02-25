import { Injectable } from '@nestjs/common';
import { paginator, PaginatorTypes, PrismaService } from '@rumsan/prisma';
import { AccountTxn } from '@rumsan/raman/types/accountTxn.type';
import { CreateAccountTxnDto } from './dto/create-account-txn.dto';
import {
  GetAccountTxnDto,
  UpdateAccountTxnDto,
} from './dto/update-account-txn.dto';

const paginate: PaginatorTypes.PaginateFunction = paginator({ perPage: 20 });
@Injectable()
export class AccountTxnService {
  constructor(private prisma: PrismaService) {}
  async create(payload: CreateAccountTxnDto) {
    const result = await this.prisma.accountTransaction.create({
      data: payload,
    });
    return result as AccountTxn;
  }

  async findByAccount(dto: GetAccountTxnDto) {
    const paginatedResult = await paginate(
      this.prisma.accountTransaction,
      { where: { accountId: dto.accountId } },
      { page: dto.page, perPage: dto.limit },
    );
    return paginatedResult;
  }

  async update(cuid: string, payload: UpdateAccountTxnDto) {
    const updateAccountTransaction =
      await this.prisma.accountTransaction.update({
        where: { cuid },
        data: { ...payload },
      });
    return updateAccountTransaction as AccountTxn;
  }
}
