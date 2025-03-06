import { Client } from '@rumsan/raman/types';
import { Pagination } from '@rumsan/raman/types/pagination.type';
import { formatResponse } from '@rumsan/sdk/utils';
import { AxiosInstance, AxiosRequestConfig } from 'axios';

export class RClient {
  private _client: AxiosInstance;
  private _prefix = 'clients';

  constructor(private apiClient: AxiosInstance) {
    this._client = apiClient;
  }

  async create(data: Client, config?: AxiosRequestConfig) {
    const response = await this._client.post(`${this._prefix}`, data, config);
    return formatResponse<Client>(response);
  }

  async list(data?: Pagination, config?: AxiosRequestConfig) {
    const response = await this._client.get(`${this._prefix}`, {
      params: data,
      ...config,
    });
    return formatResponse<Client[]>(response);
  }

  async get(id: string, config?: AxiosRequestConfig) {
    const response = await this._client.get(`${this._prefix}/${id}`, config);
    return formatResponse<Client>(response);
  }

  async update(id: string, data: Client, config?: AxiosRequestConfig) {
    const response = await this._client.put(
      `${this._prefix}/${id}`,
      data,
      config,
    );
    return formatResponse<Client>(response);
  }

  async remove(id: string, config?: AxiosRequestConfig) {
    const response = await this._client.delete(`${this._prefix}/${id}`, config);
    return formatResponse<Client>(response);
  }
}
