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
  async createBulk(accountId: string, payload: CreateAccountTxnDto[]) {
    const txnIds = payload
      .map((txn) => txn.txnId)
      .filter((txnId) => txnId != null);

    const existingTxns = await this.prisma.accountTransaction.findMany({
      where: { txnId: { in: txnIds }, accountId },
      select: { txnId: true },
    });

    const existingTxnIds = new Set(existingTxns.map((txn) => txn.txnId));
    const newTransactions = payload
      .filter((txn) => txn.txnId !== null)
      .filter((txn) => !existingTxnIds.has(txn.txnId))
      .filter((txn) => txn.pstdDate !== null)
      .filter((txn) => txn.txnDate !== null)
      .filter((txn) => txn.txnAmount !== null)
      .filter((txn) => txn.description.indexOf(' DC') < 0)
      .map(({ txnType, pstdDate, txnDate, txnAmount, ...txn }) => ({
        ...txn,
        accountId,
        txnCode: txnType,
        pstdDate: new Date(pstdDate),
        txnDate: new Date(txnDate),
        txnAmount: parseFloat(txnAmount),
      }));

    const retData = {
      submitted: payload.length,
      saved: 0,
    };

    if (newTransactions.length > 0) {
      const { count } = await this.prisma.accountTransaction.createMany({
        data: newTransactions,
      });
      retData.saved = count;
    }
    return retData;
  }

  async listByAccount(accountId: string, dto: GetAccountTxnDto) {
    const orderBy = {};
    dto.sort = dto.sort || 'txnDate';
    dto.order = dto.order || 'desc';
    if (dto.sort) {
      orderBy[dto.sort] = dto.order;
    }

    const where = {
      accountId,
    };
    if (dto.description) {
      where['description'] = {
        contains: dto.description,
      };
    }

    const paginatedResult = await paginate<AccountTxn, any>(
      this.prisma.accountTransaction,
      { where, orderBy },
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
