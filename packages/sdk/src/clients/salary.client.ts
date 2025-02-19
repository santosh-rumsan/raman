import { formatResponse } from '@rumsan/sdk/utils';
import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { CreateSalary, EditSalary, Salary } from '../types';
import { Pagination } from '../types/pagination.type';
export class SalaryClient {
  private _client: AxiosInstance;
  private _prefix = 'salary';

  constructor(private apiClient: AxiosInstance) {
    this._client = apiClient;
  }
  async create(data: CreateSalary, config?: AxiosRequestConfig) {
    const response = await this._client.post(`${this._prefix}`, data, config);
    return formatResponse<Salary>(response);
  }

  async list(data?: Pagination, config?: AxiosRequestConfig) {
    const response = await this._client.get(`${this._prefix}`, {
      params: data,
      ...config,
    });
    return formatResponse<Salary[]>(response);
  }

  async get(id: string, config?: AxiosRequestConfig) {
    const response = await this._client.get(`${this._prefix}/${id}`, config);
    return formatResponse<Salary>(response);
  }

  async update(id: string, data: EditSalary, config?: AxiosRequestConfig) {
    const response = await this._client.put(
      `${this._prefix}/${id}`,
      data,
      config,
    );
    return formatResponse<Salary>(response);
  }

  async dispatch(id: string, data: Salary, config?: AxiosRequestConfig) {
    const response = await this._client.put(
      `${this._prefix}/dispatch/${id}`,
      data,
      config,
    );
    return formatResponse<Salary>(response);
  }

  async partialDispatch(id: string, data: Salary, config?: AxiosRequestConfig) {
    const response = await this._client.put(
      `${this._prefix}/partial-dispatch/${id}`,
      data,
      config,
    );
    return formatResponse<Salary>(response);
  }

  async delete(id: string, config?: AxiosRequestConfig) {
    const response = await this._client.delete(`${this._prefix}/${id}`, config);
    return formatResponse<Salary>(response);
  }
}
