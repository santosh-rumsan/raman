import { RumsanClient } from '@rumsan/sdk/clients';
import { CreateAxiosDefaults } from 'axios';
import { AccountTransactionClient } from './account-transaction.client';
import { AccountClient } from './account.client';
import { CategoryClient } from './category.client';
import { DepartmentClient } from './department.client';
import { ExpenseClient } from './expense.client';
import { InvoiceClient } from './invoice.client';
import { MiscClient } from './misc.client';
import { MyInvoiceClient } from './my-invoice.client';
import { ProjectClient } from './project.client';
import { PublicClient } from './public.client';

export class RamanClient extends RumsanClient {
  constructor(config: CreateAxiosDefaults) {
    super(config);
    //this.apiClient = axios.create(config);
  }

  public get Account() {
    return new AccountClient(this.apiClient);
  }

  public get AccountTransaction() {
    return new AccountTransactionClient(this.apiClient);
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

export const RamanService = new RamanClient({});
