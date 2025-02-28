import { formatResponse } from '@rumsan/sdk/utils';
import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { Account, AccountTxn, CreateAccount, EditAccount } from '../types';
import { Pagination } from '../types/pagination.type';

export class AccountClient {
  private _client: AxiosInstance;
  private _prefix = 'accounts';

  constructor(private apiClient: AxiosInstance) {
    this._client = apiClient;
  }

  async create(data: CreateAccount, config?: AxiosRequestConfig) {
    const response = await this._client.post(`${this._prefix}`, data, config);
    return formatResponse<Account>(response);
  }

  async list(data?: Pagination, config?: AxiosRequestConfig) {
    const response = await this._client.get(`${this._prefix}`, {
      params: data,
      ...config,
    });
    return formatResponse<Account[]>(response);
  }

  async listTransactions(
    id: string,
    data?: Pagination & { description?: string },
    config?: AxiosRequestConfig,
  ) {
    const response = await this._client.get(
      `${this._prefix}/${id}/transactions`,
      {
        params: data,
        ...config,
      },
    );
    return formatResponse<AccountTxn[]>(response);
  }

  async findOne(id: string, config?: AxiosRequestConfig) {
    const response = await this._client.get(`${this._prefix}/${id}`, config);
    return formatResponse<Account>(response);
  }

  async update(id: string, data: EditAccount, config?: AxiosRequestConfig) {
    const response = await this._client.put(
      `${this._prefix}/${id}`,
      data,
      config,
    );
    return formatResponse(response);
  }

  async block(id: string, config?: AxiosRequestConfig) {
    const response = await this._client.put(`${this._prefix}/${id}`, config);
    return formatResponse(response);
  }

  async delete(id: string, config?: AxiosRequestConfig) {
    const response = await this._client.delete(`${this._prefix}/${id}`, config);
    return formatResponse(response);
  }
}
