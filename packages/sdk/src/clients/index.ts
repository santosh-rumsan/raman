import { AccountTxnClient } from '@rumsan/raman/clients/account-transaction.client';
import { AccountClient } from '@rumsan/raman/clients/account.client';
import { CategoryClient } from '@rumsan/raman/clients/category.client';
import { DemoClient } from '@rumsan/raman/clients/demo.client';
import { DepartmentClient } from '@rumsan/raman/clients/department.client';
import { ExpenseClient } from '@rumsan/raman/clients/expense.client';
import { InvoiceClient } from '@rumsan/raman/clients/invoice.client';
import { MiscClient } from '@rumsan/raman/clients/misc.client';
import { MyInvoiceClient } from '@rumsan/raman/clients/my-invoice.client';
import { ProjectClient } from '@rumsan/raman/clients/project.client';
import { PublicClient } from '@rumsan/raman/clients/public.client';
import { RumsanClient } from '@rumsan/sdk/clients';
import { CreateAxiosDefaults } from 'axios';

export class ApiClient extends RumsanClient {
  private eventEmitter: any;
  constructor(config: CreateAxiosDefaults, eventEmitter?: any) {
    super(config);
    this.eventEmitter = eventEmitter;
    this.apiClient.interceptors.response.use(
      (response) => response,
      (err) => {
        this.eventEmitter?.emit('APIERROR', {
          message: err?.message,
          status: err?.status,
          name: err?.response?.statusText,
          data: err?.response?.data,
        });
        return err?.response;
      },
    );
    //this.apiClient = axios.create(config);
  }

  public get Demo() {
    return new DemoClient(this.apiClient);
  }

  public get Account() {
    return new AccountClient(this.apiClient);
  }

  public get AccountTransaction() {
    return new AccountTxnClient(this.apiClient);
  }

  public get Category() {
    return new CategoryClient(this.apiClient);
  }

  public get Department() {
    return new DepartmentClient(this.apiClient);
  }

  public get Invoice() {
    return new InvoiceClient(this.apiClient);
  }

  public get MyInvoice() {
    return new MyInvoiceClient(this.apiClient);
  }

  public get Expense() {
    return new ExpenseClient(this.apiClient);
  }

  public get Misc() {
    return new MiscClient(this.apiClient);
  }

  public get Project() {
    return new ProjectClient(this.apiClient);
  }

  public get Public() {
    return new PublicClient(this.apiClient);
  }
}

export const ApiService = new ApiClient({}, null);
