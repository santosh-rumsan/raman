import { Account } from './account.type';
import { AccountTransaction } from './accountTransaction.type';
import { Category } from './category.type';
import { CommonFields } from './common.type';
import { Department } from './department.type';
import { Currency, InvoiceType } from './enums';
import { Project } from './project.type';
import { Salary } from './salary.type';

export interface ExpenseBase<T = string> {
  date: Date;
  description: string;
  currency: Currency;
  amount: number | 0;
  departmentId: string;
  categoryId: string;
  projectId?: string | null;
  accountId?: string | null;
  attachments?: Record<string, string>;
  invoiceType?: InvoiceType;
  vatAmount?: number | 0;
  source?: string;
  remarks?: string | null;
  isPending?: boolean | false;
  extras?: Record<string, T>;
}

export type Expense<T = string> = ExpenseBase<T> &
  CommonFields & {
    cuid: string;
  };

export type ExpenseExtended<T = string> = Expense<T> & {
  cuid?: string | null;
  AccountTransaction?: AccountTransaction[];
  Salary?: Salary;
  Project?: Project;
  Category?: Category;
  Account?: Account;
  Department?: Department;
};

export type CreateExpense = ExpenseBase;
export type EditExpense = Partial<CreateExpense>;
