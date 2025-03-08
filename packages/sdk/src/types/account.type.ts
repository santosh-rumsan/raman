import { CommonFields } from '@rumsan/raman/types/common.type';

export type AccountBase = {
  name: string;
  bankCode?: string;
  acctNumber?: string;
  currency: string;
  balance?: number;
  balanceLastUpdatedAt?: Date;
};

export type Account = AccountBase & CommonFields & { cuid: string };

export type CreateAccount = AccountBase;
export type EditAccount = Partial<CreateAccount>;
