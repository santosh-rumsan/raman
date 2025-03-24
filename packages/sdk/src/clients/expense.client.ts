import {
  CreateExpense,
  EditExpense,
  Expense,
  InvoiceType,
} from '@rumsan/raman/types';
import { Pagination } from '@rumsan/raman/types/pagination.type';
import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { formatResponse } from './response.utils';

export class ExpenseClient {
  private _client: AxiosInstance;
  private _prefix = 'expenses';
  constructor(private apiClient: AxiosInstance) {
    this._client = apiClient;
  }

  async create(data: CreateExpense, config?: AxiosRequestConfig) {
    const response = await this._client.post(`${this._prefix}`, data, config);
    return formatResponse<Expense>(response);
  }

  async uploadAttachments(
    cuid: string,
    data: FormData,
    config?: AxiosRequestConfig,
  ) {
    const response = await this._client.post(
      `${this._prefix}/${cuid}/attachments`,
      data,
      config,
    );
    return formatResponse<Expense>(response);
  }

  async deleteAttachment(
    cuid: string,
    hash: string,
    config?: AxiosRequestConfig,
  ) {
    const response = await this._client.delete(
      `${this._prefix}/${cuid}/attachments/${hash}`,
      config,
    );
    return formatResponse<Expense>(response);
  }

  async list(data?: Pagination, config?: AxiosRequestConfig) {
    const response = await this._client.get(`${this._prefix}`, {
      params: data,
      ...config,
    });
    return formatResponse<Expense[]>(response);
  }

  async search(
    params?: Pagination,
    filters?: any,
    config?: AxiosRequestConfig,
  ) {
    const response = await this._client.post(
      `${this._prefix}/search`,
      filters,
      {
        params,
        ...config,
      },
    );
    return formatResponse<Expense[]>(response);
  }

  async get(cuid: string, config?: AxiosRequestConfig) {
    const response = await this._client.get(`${this._prefix}/${cuid}`, config);
    return formatResponse<Expense>(response);
  }

  async update(cuid: string, data: EditExpense, config?: AxiosRequestConfig) {
    const response = await this._client.patch(
      `${this._prefix}/${cuid}`,
      data,
      config,
    );
    return formatResponse<Expense>(response);
  }

  async delete(cuid: string, config?: AxiosRequestConfig) {
    const response = await this._client.delete(
      `${this._prefix}/${cuid}`,
      config,
    );
    return formatResponse<Expense>(response);
  }

  async verify(
    cuid: string,
    receiptType: InvoiceType,
    config?: AxiosRequestConfig,
  ) {
    const response = await this._client.patch(
      `${this._prefix}/${cuid}/verify`,
      { receiptType },
      config,
    );
    return formatResponse<Expense>(response);
  }
}
