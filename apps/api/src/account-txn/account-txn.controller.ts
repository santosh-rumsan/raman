import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { xRC } from '@rumsan/extensions/decorators';
import { ACTIONS, APP, SUBJECTS } from '@rumsan/raman/constants';
import { tRC } from '@rumsan/sdk/types';
import { AbilitiesGuard, CheckAbilities, JwtGuard } from '@rumsan/user';
import { AccountTxnService } from './account-txn.service';
import { CreateAccountTxnDto } from './dto/create-account-txn.dto';
import { GetAccountTxnDto } from './dto/update-account-txn.dto';

@Controller('account-txn')
@ApiTags('AccountTxn')
@ApiBearerAuth(APP.JWT_BEARER)
@UseGuards(JwtGuard, AbilitiesGuard)
export class AccountTxnController {
  constructor(private readonly accountTxnService: AccountTxnService) {}

  @Post()
  @CheckAbilities({ actions: ACTIONS.CREATE, subject: SUBJECTS.ACCOUNT })
  create(@Body() payload: CreateAccountTxnDto, @xRC() rc: tRC) {
    return this.accountTxnService.create(payload);
  }

  @Get()
  @CheckAbilities({ actions: ACTIONS.READ, subject: SUBJECTS.ACCOUNT })
  //TODO: fix any
  getAccounts(@Query() query: GetAccountTxnDto): any {
    return this.accountTxnService.findByAccount(query);
  }
}
