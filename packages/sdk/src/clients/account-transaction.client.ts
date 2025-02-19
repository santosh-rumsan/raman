import { formatResponse } from '@rumsan/sdk/utils';
import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { AccountTransaction } from '../types';

export class AccountTransactionClient {
  private _client: AxiosInstance;
  private _prefix = 'account-transactions';
  constructor(private apiClient: AxiosInstance) {
    this._client = apiClient;
  }

  async create(data: any, config?: AxiosRequestConfig) {
    const response = await this._client.post(`${this._prefix}`, data, config);
    return formatResponse<AccountTransaction>(response);
  }

  async list(data: AccountTransaction, config?: AxiosRequestConfig) {
    const response = await this._client.get(`${this._prefix}`, {
      params: data,
      ...config,
    });
    return formatResponse<AccountTransaction[]>(response);
  }

  async findOne(id: string, config?: AxiosRequestConfig) {
    const response = await this._client.get(`${this._prefix}/${id}`, config);
    return formatResponse(response);
  }

  async update(
    id: string,
    data: AccountTransaction,
    config?: AxiosRequestConfig,
  ) {
    const response = await this._client.put(
      `${this._prefix}/${id}`,
      data,
      config,
    );
    return formatResponse<AccountTransaction>(response);
  }

  async delete(id: string, config?: AxiosRequestConfig) {
    const response = await this._client.delete(`${this._prefix}/${id}`, config);
    return formatResponse(response);
  }
}
