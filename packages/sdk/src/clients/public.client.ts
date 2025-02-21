import { formatResponse } from '@rumsan/sdk/utils';
import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { Category } from '../types';
import {
  Invoice,
  InvoiceApprovalDto,
  InvoiceRejectionDto,
} from '../types/invoice.type';

export class PublicClient {
  private _client: AxiosInstance;
  private _prefix = 'public';
  constructor(private apiClient: AxiosInstance) {
    this._client = apiClient;
  }

  async getAllCategories(config?: AxiosRequestConfig) {
    const response = await this._client.get(`${this._prefix}/category`, config);
    return formatResponse<Category>(response);
  }

  async getInvoicesByChallange(
    approvalChallenge: string,
    config?: AxiosRequestConfig,
  ) {
    const response = await this._client.get(
      `${this._prefix}/invoices/${approvalChallenge}`,
      config,
    );
    return formatResponse<Invoice>(response);
  }

  async rejectInvoice(
    approvalChallenge: string,
    payload: InvoiceRejectionDto,
    config?: AxiosRequestConfig,
  ) {
    const response = await this._client.patch(
      `${this._prefix}/invoices/${approvalChallenge}/reject`,
      payload,
      config,
    );
    return formatResponse<Invoice>(response);
  }

  async approveInvoice(
    approvalChallenge: string,
    payload: InvoiceApprovalDto,
    config?: AxiosRequestConfig,
  ) {
    const response = await this._client.patch(
      `${this._prefix}/invoices/${approvalChallenge}/approve`,
      payload,
      config,
    );
    return formatResponse<Invoice>(response);
  }
}
