export type DraftStatus = 'OPEN' | 'CLOSE';
export const DraftStatus = {
  OPEN: 'OPEN' as DraftStatus,
  CLOSE: 'CLOSE' as DraftStatus,
};

export type SalaryStatus = 'PAID' | 'PARTIAL' | 'UNPAID';
export const SalaryStatus = {
  PAID: 'PAID' as SalaryStatus,
  PARTIAL: 'PARTIAL' as SalaryStatus,
  UNPAID: 'UNPAID' as SalaryStatus,
};

export type TxType = 'EXPENSE' | 'ADJUSTMENT' | 'TRANSFER' | 'INCOME';
export const TxType = {
  EXPENSE: 'EXPENSE' as TxType,
  ADJUSTMENT: 'ADJUSTMENT' as TxType,
  TRANSFER: 'TRANSFER' as TxType,
  INCOME: 'INCOME' as TxType,
};

export type UserType = 'EMPLOYEE' | 'VOLUNTEER' | 'CONTRACTOR' | 'INTERN';
export const UserType = {
  EMPLOYEE: 'EMPLOYEE' as UserType,
  VOLUNTEER: 'VOLUNTEER' as UserType,
  CONTRACTOR: 'CONTRACTOR' as UserType,
  INTERN: 'INTERN' as UserType,
};

export type InvoiceType =
  | 'VAT'
  | 'PAN'
  | 'ESTIMATE'
  | 'BANK_TRANSFER'
  | 'VOUCHER';
export const InvoiceType = {
  VAT: 'VAT' as InvoiceType,
  PAN: 'PAN' as InvoiceType,
  ESTIMATE: 'ESTIMATE' as InvoiceType,
  BANK_TRANSFER: 'BANK_TRANSFER' as InvoiceType,
  VOUCHER: 'VOUCHER' as InvoiceType,
};

export type InvoiceStatusType =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'REIMBURSED';
export const InvoiceStatusType = {
  PENDING: 'PENDING' as InvoiceStatusType,
  APPROVED: 'APPROVED' as InvoiceStatusType,
  REJECTED: 'REJECTED' as InvoiceStatusType,
  REIMBURSED: 'REIMBURSED' as InvoiceStatusType,
};

export type Currency = 'NPR' | 'USD' | 'GBP' | 'EUR' | 'USDC';
export const Currency = {
  NPR: 'NPR' as Currency,
  USD: 'USD' as Currency,
  GBP: 'GBP' as Currency,
  EUR: 'EUR' as Currency,
  USDC: 'USDC' as Currency,
};

export type AccountTxnStatus = 'UNRECONCILED' | 'RECONCILED' | 'DISCARDED';
export const AccountTxnStatus = {
  UNRECONCILED: 'UNRECONCILED' as AccountTxnStatus,
  RECONCILED: 'RECONCILED' as AccountTxnStatus,
  DISCARDED: 'DISCARDED' as AccountTxnStatus,
};

export type AccountTxnType = 'INCOME' | 'EXPENSE' | 'TRANSFER' | 'ADJUSTMENT';
export const AccountTxnType = {
  INCOME: 'INCOME' as AccountTxnType,
  EXPENSE: 'EXPENSE' as AccountTxnType,
  TRANSFER: 'TRANSFER' as AccountTxnType,
  ADJUSTMENT: 'ADJUSTMENT' as AccountTxnType,
};
