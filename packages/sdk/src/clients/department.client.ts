import {
  CreateDepartment,
  Department,
  EditDepartment,
} from '@rumsan/raman/types';
import { Pagination } from '@rumsan/raman/types/pagination.type';
import { formatResponse } from '@rumsan/sdk/utils';
import { AxiosInstance, AxiosRequestConfig } from 'axios';

export class DepartmentClient {
  private _client: AxiosInstance;
  private _prefix = 'departments';
  constructor(private apiClient: AxiosInstance) {
    this._client = apiClient;
  }

  async create(data: CreateDepartment, config?: AxiosRequestConfig) {
    const response = await this._client.post(`${this._prefix}`, data, config);
    return formatResponse<Department>(response);
  }

  async list(data?: Pagination, config?: AxiosRequestConfig) {
    const response = await this._client.get(`${this._prefix}`, {
      params: data,
      ...config,
    });
    return formatResponse<Department[]>(response);
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
    return formatResponse<Department[]>(response);
  }

  async get(id: string, config?: AxiosRequestConfig) {
    const response = await this._client.get(`${this._prefix}/${id}`, config);
    return formatResponse<Department>(response);
  }

  async update(id: string, data: EditDepartment, config?: AxiosRequestConfig) {
    const response = await this._client.put(
      `${this._prefix}/${id}`,
      data,
      config,
    );
    return formatResponse<Department>(response);
  }

  async delete(id: string, config?: AxiosRequestConfig) {
    const response = await this._client.delete(`${this._prefix}/${id}`, config);
    return formatResponse<Department>(response);
  }
}
