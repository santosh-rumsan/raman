import { AccountTxn } from '@rumsan/raman/types';
import { formatResponse } from '@rumsan/sdk/utils';
import { AxiosInstance, AxiosRequestConfig } from 'axios';

export class AccountTxnClient {
  private _client: AxiosInstance;
  private _prefix = 'account-transactions';
  constructor(private apiClient: AxiosInstance) {
    this._client = apiClient;
  }

  async create(data: any, config?: AxiosRequestConfig) {
    const response = await this._client.post(`${this._prefix}`, data, config);
    return formatResponse<AccountTxn>(response);
  }

  async list(data: AccountTxn, config?: AxiosRequestConfig) {
    const response = await this._client.get(`${this._prefix}`, {
      params: data,
      ...config,
    });
    return formatResponse<AccountTxn[]>(response);
  }

  async findOne(id: string, config?: AxiosRequestConfig) {
    const response = await this._client.get(`${this._prefix}/${id}`, config);
    return formatResponse(response);
  }

  async update(id: string, data: AccountTxn, config?: AxiosRequestConfig) {
    const response = await this._client.put(
      `${this._prefix}/${id}`,
      data,
      config,
    );
    return formatResponse<AccountTxn>(response);
  }

  async delete(id: string, config?: AxiosRequestConfig) {
    const response = await this._client.delete(`${this._prefix}/${id}`, config);
    return formatResponse(response);
  }
}
