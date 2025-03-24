import { CommonFields } from '@rumsan/raman/types/common.type';
import {
  Currency,
  InvoiceStatusType,
  InvoiceType,
} from '@rumsan/raman/types/enums';

export type InvoiceBase<T = string> = {
  date: Date;
  description: string;
  amount: number | 0;
  userId: string;
  currency: Currency;
  categoryId: string;
  vatAmount?: number | 0;
  projectId?: string | null;
  invoiceType: InvoiceType;
  extras?: Record<string, T>;
  bankTransferFees?: number | 0;
};

export type InvoiceApprovalDetails = {
  isApproved: boolean;
  date: Date;
  approvedBy: string;
  remarks?: string;
};

export type InvoiceReimburseDetails = {
  date: Date;
  remarks?: string;
};

export type Invoice<T = string> = InvoiceBase<T> &
  CommonFields & {
    cuid: string;
    expenseId?: string | null;
    status?: InvoiceStatusType;
    attachments?: Record<string, any>[];
    approvalDetails?: InvoiceApprovalDetails | Record<string, any>;
    reimburseDetails?: InvoiceReimburseDetails | Record<string, any>;
  };

export type InvoiceExtended = Invoice & {
  Category: Record<string, any>;
  Project: Record<string, any>;
  Department: Record<string, any>;
  User: Record<string, any>;
  Expense: Record<string, any>;
};

export type CreateInvoice = InvoiceBase;
export type EditInvoice = Partial<CreateInvoice>;

// export type InvoiceRejectionDto = {
//   reason: string;
// };
// export type InvoiceApprovalDto = Pick<
//   CreateInvoice,
//   'categoryId' | 'description'
//   >;

export type ReceiptApproval = {
  status: 'APPROVED' | 'REJECTED';
  remarks?: string;
};

export type ReceiptReimbursement = {
  date: Date;
  amount: number;
  categoryId: string;
  accountId: string;
  bankTransferFees?: number;
  remarks?: string;
  attachments?: Record<string, any>[];
  expenseId?: string;
};
