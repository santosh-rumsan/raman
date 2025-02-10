export enum DraftStatus {
  OPEN = 'OPEN',
  CLOSE = 'CLOSE',
}

export enum SalaryStatus {
  PAID = 'PAID',
  PARTIAL = 'PARTIAL',
  UNPAID = 'UNPAID',
}

export enum TxType {
  EXPENSE = 'EXPENSE',
  ADJUSTMENT = 'ADJUSTMENT',
  TRANSFER = 'TRANSFER',
  INCOME = 'INCOME',
}

export enum UserType {
  EMPLOYEE = 'EMPLOYEE',
  VOLUNTEER = 'VOLUNTEER',
  CONTRACTOR = 'CONTRACTOR',
  INTERN = 'INTERN',
}
export enum InvoiceType {
  VAT = 'VAT',
  PAN = 'PAN',
  ESTIMATE = 'ESTIMATE',
}

export enum InvoiceStatusType {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  REIMBURSED = 'REIMBURSED',
}

export enum Currency {
  NPR = 'NPR',
  USD = 'USD',
  GBP = 'GBP',
  EUR = 'EUR',
  USDC = 'USDC',
}
