import { Category, CreateCategory, EditCategory } from '@rumsan/raman/types';
import { Pagination } from '@rumsan/raman/types/pagination.type';
import { formatResponse } from '@rumsan/sdk/utils';
import { AxiosInstance, AxiosRequestConfig } from 'axios';

export class CategoryClient {
  private _client: AxiosInstance;
  private _prefix = 'categories';

  constructor(private apiClient: AxiosInstance) {
    this._client = apiClient;
  }

  async create(data: CreateCategory, config?: AxiosRequestConfig) {
    const response = await this._client.post(`${this._prefix}`, data, config);
    return formatResponse<Category>(response);
  }

  async get(id: string, config?: AxiosRequestConfig) {
    const response = await this._client.get(`${this._prefix}/${id}`, config);
    return formatResponse<Category>(response);
  }

  async list(data?: Pagination, config?: AxiosRequestConfig) {
    const response = await this._client.get(`${this._prefix}`, {
      params: data,
      ...config,
    });
    return formatResponse<Category[]>(response);
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
    return formatResponse<Category[]>(response);
  }

  async update(id: string, data: EditCategory, config?: AxiosRequestConfig) {
    const response = await this._client.put(
      `${this._prefix}/${id}`,
      data,
      config,
    );
    return formatResponse<Category>(response);
  }

  async delete(id: string, config?: AxiosRequestConfig) {
    const response = await this._client.delete(`${this._prefix}/${id}`, config);
    return formatResponse<Category>(response);
  }
}
