import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { xRC } from '@rumsan/extensions/decorators';
import { tRC } from '@rumsan/sdk/types';
import { AccountTxnService } from './account-txn.service';
import { CreateAccountTxnDto } from './dto/create-account-txn.dto';

@Controller('account-txn-app')
@ApiTags('AccountTxnApp')
export class AccountTxnAppController {
  constructor(private readonly accountTxnService: AccountTxnService) {}

  @Post()
  create(@Body() payload: CreateAccountTxnDto, @xRC() rc: tRC) {
    return this.accountTxnService.create(payload);
  }
}
