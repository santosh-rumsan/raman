import { CommonFields } from './common.type';
import { AccountTxnStatus, AccountTxnType } from './enums';

export interface AccountTxnBase {
  accountId: string;
  expenseId?: string;
  status: AccountTxnStatus;
  type?: AccountTxnType;

  pstdDate?: Date;
  txnCurrencyCode: string;
  description: string;
  txnCode?: string;
  debitAmount: number;
  creditAmount: number;
  balanceAmount: number;
  chequeNumber?: string;
  txnAmount?: number;
  txnDate: Date;
  txnId: string;
}

export type AccountTxn = AccountTxnBase & CommonFields & { cuid: string };
