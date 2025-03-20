import { Category } from '@rumsan/raman/types';
import { Invoice, ReceiptApproval } from '@rumsan/raman/types/invoice.type';
import { formatResponse } from '@rumsan/sdk/utils';
import { AxiosInstance, AxiosRequestConfig } from 'axios';

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

  async approveOrRejectReceipt(
    approvalChallenge: string,
    payload: ReceiptApproval,
    config?: AxiosRequestConfig,
  ) {
    console.log(payload);
    const action = payload.status === 'APPROVED' ? 'approve' : 'reject';
    const url = `${this._prefix}/invoices/${approvalChallenge}/${action}`;
    const response = await this._client.patch(url, payload, config);
    return formatResponse<Invoice>(response);
  }

  async rejectInvoice(
    approvalChallenge: string,
    payload: ReceiptApproval,
    config?: AxiosRequestConfig,
  ) {
    payload.status = 'REJECTED';
    return this.approveOrRejectReceipt(approvalChallenge, payload, config);
  }

  async approveInvoice(
    approvalChallenge: string,
    payload: ReceiptApproval,
    config?: AxiosRequestConfig,
  ) {
    payload.status = 'APPROVED';
    return this.approveOrRejectReceipt(approvalChallenge, payload, config);
  }
}
