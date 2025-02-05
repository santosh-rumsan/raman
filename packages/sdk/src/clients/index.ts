import {RumsanClient} from '@rumsan/sdk/clients';
import {CreateAxiosDefaults} from 'axios';
import {DemoClient} from './demo.client';

export class ApiClient extends RumsanClient {
  constructor(config: CreateAxiosDefaults) {
    super(config);
  }

  public get Demo() {
    return new DemoClient(this.apiClient);
  }
}
