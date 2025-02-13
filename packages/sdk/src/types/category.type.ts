import { CommonFields } from './common.type';
import { Invoice } from './invoice.type';

export interface CategoryBase {
  name: string;
  Invoice?: Invoice[];
  meta?: { icon: string };
  extras?: Record<string, any>;
}

export type Category = CategoryBase & CommonFields & { cuid?: string };

export type CreateCategory = CategoryBase;
export type EditCategory = Partial<CreateCategory>;
