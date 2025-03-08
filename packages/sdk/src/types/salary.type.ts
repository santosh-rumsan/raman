import { CommonFields } from '@rumsan/raman/types/common.type';
import { SalaryStatus } from '@rumsan/raman/types/enums';

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
