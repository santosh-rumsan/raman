import { CommonFields } from '@rumsan/raman/types/common.type';
import { Invoice } from './invoice.type';

export interface ProjectBase {
  name: string;
  departmentId: string;
  owner?: string;
  Invoice?: Invoice[];
  meta?: Record<string, any>;
  extras?: Record<string, any>;
}

export type Project = ProjectBase & CommonFields & { cuid?: string };
export type CreateProject = ProjectBase;
export type EditProject = Partial<CreateProject>;
