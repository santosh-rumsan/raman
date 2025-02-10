import { CommonFields } from './common.type';
import { InvoiceStatusType, InvoiceType } from './enums';

export type InvoiceBase<T = string> = {
  date: Date;
  description: string;
  amount: number | 0;
  userId: string;
  currency: string;
  approvalChallenge: string;
  categoryId?: string | null;
  vatAmount?: number | 0;
  projectId?: string | null;
  receipts?: Record<string, string>;
  reason?: string | null;
  isApproved?: boolean;
  rejectOrApprove?: boolean;
  status?: InvoiceStatusType;
  invoiceType?: InvoiceType;
  expenseId?: string | null;
  reimbursedDate?: Date;
  reimbursedRemarks?: string | null;
  accountId?: string | null;
  extras?: Record<string, T>;
};
export type Invoice<T = string> = InvoiceBase<T> &
  CommonFields & { cuid?: string | null };
