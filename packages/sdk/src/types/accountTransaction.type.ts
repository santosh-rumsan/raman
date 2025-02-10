import { Account } from './account.type';
import { CommonFields } from './common.type';
import { Expense } from './expense.type';

export enum AccountTxnStatus {
  UNRECONCILED = 'UNRECONCILED',
  RECONCILED = 'RECONCILED',
  DISCARDED = 'DISCARDED',
}

export enum AccountTxnType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  TRANSFER = 'TRANSFER',
  ADJUSTMENT = 'ADJUSTMENT',
}

export interface AccountTransactionBase {
  accountId: string;
  expenseId?: string;
  status: AccountTxnStatus;
  type?: AccountTxnType;

  pstdDate: Date;
  txnCurrencyCode: string;
  description: string;
  txnType: string;
  debitAmount: number;
  creditAmount: number;
  balanceAmount: number;
  chequeNumber?: string;
  txnAmount: number;
  txnDate: Date;
  txnId: string;

  Account?: Account[];
  Expense?: Expense[];
}

export type AccountTransaction = AccountTransactionBase &
  CommonFields & { cuid: string };
