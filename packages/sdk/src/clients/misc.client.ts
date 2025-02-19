import { formatResponse } from '@rumsan/sdk/utils';
import { AxiosInstance, AxiosRequestConfig } from 'axios';

export type LookupData = {
  departments: { name: string; cuid: string; meta?: Record<string, any> }[];
  categories: {
    name: string;
    cuid: string;
    group: string;
    meta?: Record<string, any>;
  }[];
  projects: { name: string; cuid: string; meta?: Record<string, any> }[];
  accounts: { name: string; cuid: string; meta?: Record<string, any> }[];
  users: { name: string; cuid: string; meta?: Record<string, any> }[];
};

export class MiscClient {
  private _client: AxiosInstance;
  private _prefix = 'misc';

  constructor(apiClient: AxiosInstance) {
    this._client = apiClient;
  }

  async getLookupData(config?: AxiosRequestConfig) {
    const response = await this._client.get(`${this._prefix}/lookup`, config);
    return formatResponse<LookupData>(response);
  }
}
