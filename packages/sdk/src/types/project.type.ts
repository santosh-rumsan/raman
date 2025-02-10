import { CommonFields } from './common.type';
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
