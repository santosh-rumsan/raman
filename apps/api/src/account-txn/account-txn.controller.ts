import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ACTIONS, APP, SUBJECTS } from '@rumsan/raman/constants';
import { AbilitiesGuard, CheckAbilities, JwtGuard } from '@rumsan/user';
import { AccountTxnService } from './account-txn.service';
import { GetAccountTxnDto } from './dto/update-account-txn.dto';

@Controller('account-txn')
@ApiTags('AccountTxn')
@ApiBearerAuth(APP.JWT_BEARER)
@UseGuards(JwtGuard, AbilitiesGuard)
export class AccountTxnController {
  constructor(private readonly accountTxnService: AccountTxnService) {}

  @Get(':cuid')
  @CheckAbilities({ actions: ACTIONS.READ, subject: SUBJECTS.ACCOUNT })
  //TODO: fix any
  getAccounts(
    @Param('cuid') accountId: string,
    @Query() query: GetAccountTxnDto,
  ): any {
    return this.accountTxnService.listByAccount(accountId, query);
  }
}
