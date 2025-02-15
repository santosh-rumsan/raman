import { AccountTransaction } from './accountTransaction.type';
import { CommonFields } from './common.type';
import { Expense } from './expense.type';

export type AccountBase = {
  name: string;
  acctNumber?: string;
  currency: string;
  balance?: number;
  balanceLastUpdatedAt?: Date;
  Expense?: Expense[];
  AccountTransaction?: AccountTransaction[];
};

export type Account = AccountBase & CommonFields & { cuid: string };

export type CreateAccount = AccountBase;
export type EditAccount = Partial<CreateAccount>;
