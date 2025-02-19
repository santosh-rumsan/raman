import { CommonFields } from './common.type';
import { SalaryStatus } from './enums';

export interface SalaryBase {
  employeeId: string;
  salaryDraftId: string;
  amountDue: number;
  amountPaid: number;
  isPartial: boolean;
  expenseId: string;
  status: SalaryStatus;
  isArchived: boolean;
}

export type Salary = SalaryBase & CommonFields & { cuid: string };

export type CreateSalary = SalaryBase;
export type EditSalary = Partial<CreateSalary>;
