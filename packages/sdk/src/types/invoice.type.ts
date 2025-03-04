import { CommonFields } from './common.type';
import { Currency, InvoiceStatusType, InvoiceType } from './enums';

export type InvoiceBase<T = string> = {
  date: Date;
  description: string;
  amount: number | 0;
  userId: string;
  currency: Currency;
  approvalChallenge: string;
  categoryId: string;
  vatAmount?: number | 0;
  projectId?: string | null;
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
  CommonFields & { cuid: string; receipts?: Record<string, string>[] };

export type CreateInvoice = InvoiceBase;
export type EditInvoice = Partial<CreateInvoice>;

export type InvoiceRejectionDto = {
  reason: string;
};
export type InvoiceApprovalDto = Pick<
  CreateInvoice,
  'categoryId' | 'description'
>;
