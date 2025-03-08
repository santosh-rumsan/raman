import { CommonFields } from '@rumsan/raman/types/common.type';
import { DraftStatus } from '@rumsan/raman/types/enums';
import { Salary } from './salary.type';

export interface SalaryDraftBase {
  month: number;
  year: number;
  status: DraftStatus;
  numberOfEmployee: number;
  numberOfEmployeePaid: number;
  totalAmountDue: number | null;
  totalAmountPaid: number;
  Salary?: Salary[];
}

export type SalaryDraft = SalaryDraftBase & CommonFields & { cuid: string };

export type CreateSalaryDraft = SalaryDraftBase;
export type EditSalaryDraft = Partial<CreateSalaryDraft>;
