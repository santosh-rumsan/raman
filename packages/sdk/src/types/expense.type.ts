import { CommonFields } from '@rumsan/raman/types/common.type';
import { Currency, InvoiceType } from '@rumsan/raman/types/enums';
import { Account } from './account.type';
import { Category } from './category.type';
import { Department } from './department.type';
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
  invoiceType: InvoiceType;
  vatAmount?: number | 0;
  source?: string;
  remarks?: string | null;
  extras?: Record<string, T>;
}

export type Expense<T = string> = ExpenseBase<T> &
  CommonFields & {
    cuid: string;
    attachments?: Record<string, any>[];
    verificationDetails?: Record<string, string>;
    isVerified: boolean;
    reconcileDetails?: Record<string, string>;
    isReconciled: boolean;
  };

export type ExpenseExtended<T = string> = Expense<T> & {
  cuid?: string | null;
  Salary?: Salary;
  Project?: Project;
  Category?: Category;
  Account?: Account;
  Department?: Department;
};

export type CreateExpense = ExpenseBase;
export type EditExpense = Partial<CreateExpense>;
