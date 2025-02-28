import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { xRC } from '@rumsan/extensions/decorators';
import { tRC } from '@rumsan/sdk/types';
import { AccountService } from '../account/account.service';
import { AccountTxnService } from './account-txn.service';
import { CreateAccountTxnDto } from './dto/create-account-txn.dto';

@Controller('account-txn-app')
@ApiTags('AccountTxnApp')
export class AccountTxnAppController {
  constructor(
    private readonly accountTxnService: AccountTxnService,
    private readonly accountService: AccountService,
  ) {}

  @Post(':cuid/txns')
  create(
    @Param('cuid') cuid: string,
    @Body() payload: CreateAccountTxnDto[],
    @xRC() rc: tRC,
  ) {
    return this.accountTxnService.createBulk(cuid, payload);
  }

  @Post(':cuid/balance')
  updateBalance(
    @Param('cuid') cuid: string,
    @Body() payload: { balance: number },
    @xRC() rc: tRC,
  ) {
    return this.accountService.update(cuid, payload, rc);
  }
}
