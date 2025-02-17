import { CommonFields } from './common.type';

export type AccountBase = {
  name: string;
  acctNumber?: string;
  currency: string;
  balance?: number;
  balanceLastUpdatedAt?: Date;
};

export type Account = AccountBase & CommonFields & { cuid: string };

export type CreateAccount = AccountBase;
export type EditAccount = Partial<CreateAccount>;
