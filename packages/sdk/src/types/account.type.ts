import { AccountTransaction } from './accountTransaction.type';
import { CommonFields } from './common.type';
import { Expense } from './expense.type';

export type AccountBase = {
  name: string;
  number?: string;
  currency: string;
  balance?: number;
  balanceLastUpdatedAt?: Date;
  Expense?: Expense[];
  AccountTransaction?: AccountTransaction[];
};

export type Account = AccountBase & CommonFields & { cuid: string };
