import { CommonFields } from './common.type';

export interface ClientBase {
  name: string;
  country: string;
  email?: string;
  extras?: Record<string, any>;
}

export type Client = ClientBase & CommonFields & { cuid: string };
