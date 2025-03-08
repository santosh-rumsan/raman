import { UserType } from '@rumsan/raman/types/enums';

export interface UserDetails {
  departmentId?: string | null;
  salary?: number;
  accountId?: string;
  userType?: UserType;
  isApproved?: boolean;
  isEmployee?: boolean;
  extras?: Record<string, unknown>;
}
