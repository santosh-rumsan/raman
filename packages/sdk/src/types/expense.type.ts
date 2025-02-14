import { Account } from './account.type';
import { AccountTransaction } from './accountTransaction.type';
import { Category } from './category.type';
import { CommonFields } from './common.type';
import { Department } from './department.type';
import { InvoiceType } from './enums';
import { Project } from './project.type';
import { Salary } from './salary.type';

export interface ExpenseBase<T = string> {
  date: Date;
  description: string;
  currency: string;
  amount: number | 0;
  departmentId: string;
  categoryId: string;
  projectId?: string | null;
  accountId?: string | null;
  attachments?: Record<string, string>;
  invoiceType?: InvoiceType;
  vatAmount?: number | 0;
  source?: string | null;
  remarks?: string | null;
  isPending?: boolean | false;
  AccountTransaction?: AccountTransaction[];
  Salary?: Salary;
  Project?: Project;
  Category?: Category;
  Account?: Account;
  Department?: Department;
  extras?: Record<string, T>;
}

export type Expense<T = string> = ExpenseBase<T> &
  CommonFields & { cuid?: string | null };

export type CreateExpense = ExpenseBase;
export type EditExpense = Partial<CreateExpense>;
