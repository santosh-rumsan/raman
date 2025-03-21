import { ReportingDTO } from '@rumsan/raman/types/reporting.type';
import { formatResponse } from '@rumsan/sdk/utils';
import { AxiosInstance, AxiosRequestConfig } from 'axios';

export class ReportingClient {
  private _client: AxiosInstance;
  private _prefix = 'reporting';

  constructor(private apiClient: AxiosInstance) {
    this._client = apiClient;
  }

  async getCategoryReport(
    year?: number,
    month?: number,
    config?: AxiosRequestConfig,
  ) {
    const response = await this._client.get(`${this._prefix}/category`, {
      params: { year, month },
      ...config,
    });
    return formatResponse<ReportingDTO[]>(response);
  }
}
