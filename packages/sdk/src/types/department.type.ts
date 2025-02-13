import { CommonFields } from './common.type';

export type DepartmentBase = {
  name: string;
  owner?: string;
  meta?: Record<string, any>;
  extras?: Record<string, any>;
};
export type Department = DepartmentBase & CommonFields & { cuid: string };

export type CreateDepartment = DepartmentBase;
export type EditDepartment = Partial<CreateDepartment>;
