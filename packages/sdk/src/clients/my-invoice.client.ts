import { formatResponse } from '@rumsan/sdk/utils';
import { AxiosInstance, AxiosRequestConfig } from 'axios';

import { CreateInvoice, EditInvoice, Invoice } from '../types';
import { Pagination } from '../types/pagination.type';

export class MyInvoiceClient {
  private _client: AxiosInstance;
  private _prefix = 'me/invoices';
  constructor(private apiClient: AxiosInstance) {
    this._client = apiClient;
  }

  async create(data: CreateInvoice, config?: AxiosRequestConfig) {
    const response = await this._client.post(`${this._prefix}`, data, config);
    return formatResponse<Invoice>(response);
  }

  async list(data?: Pagination, config?: AxiosRequestConfig) {
    const response = await this._client.get(`${this._prefix}`, {
      params: data,
      ...config,
    });
    return formatResponse<Invoice[]>(response);
  }

  async get(id: string, config?: AxiosRequestConfig) {
    const response = await this._client.get(`${this._prefix}/${id}`, config);
    return formatResponse<Invoice>(response);
  }

  async update(id: string, data: EditInvoice, config?: AxiosRequestConfig) {
    const response = await this._client.put(
      `${this._prefix}/${id}`,
      data,
      config,
    );
    return formatResponse<Invoice>(response);
  }

  async delete(id: string, config?: AxiosRequestConfig) {
    const response = await this._client.delete(`${this._prefix}/${id}`, config);
    return formatResponse<Invoice>(response);
  }
}
