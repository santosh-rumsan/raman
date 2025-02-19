import { formatResponse } from '@rumsan/sdk/utils';
import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { CreateSalaryDraft, EditSalaryDraft, SalaryDraft } from '../types';
import { Pagination } from '../types/pagination.type';

export class SalaryDraftClient {
  private _client: AxiosInstance;
  private _prefix = 'salary-draft';

  constructor(private apiClient: AxiosInstance) {
    this._client = apiClient;
  }
  async create(data: CreateSalaryDraft, config?: AxiosRequestConfig) {
    const response = await this._client.post(`${this._prefix}`, data, config);
    return formatResponse<SalaryDraft>(response);
  }

  async list(data?: Pagination, config?: AxiosRequestConfig) {
    const response = await this._client.get(`${this._prefix}`, {
      params: data,
      ...config,
    });
    return formatResponse<SalaryDraft[]>(response);
  }

  async get(id: string, config?: AxiosRequestConfig) {
    const response = await this._client.get(`${this._prefix}/${id}`, config);
    return formatResponse<SalaryDraft>(response);
  }

  async update(id: string, data: EditSalaryDraft, config?: AxiosRequestConfig) {
    const response = await this._client.put(
      `${this._prefix}/${id}`,
      data,
      config,
    );
    return formatResponse<SalaryDraft>(response);
  }

  async delete(id: string, config?: AxiosRequestConfig) {
    const response = await this._client.delete(`${this._prefix}/${id}`, config);
    return formatResponse<SalaryDraft>(response);
  }
}
