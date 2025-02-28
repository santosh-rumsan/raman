import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { xRC } from '@rumsan/extensions/decorators';
import { ACTIONS, APP, SUBJECTS } from '@rumsan/raman/constants';
import { tRC } from '@rumsan/sdk/types';
import { AbilitiesGuard, CheckAbilities, JwtGuard } from '@rumsan/user';
import { AccountTxnService } from '../account-txn/account-txn.service';
import { GetAccountTxnDto } from '../account-txn/dto/update-account-txn.dto';
import { AccountService } from './account.service';
import { CreateAccountDto, GetAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Controller('accounts')
@ApiTags('Account')
@ApiBearerAuth(APP.JWT_BEARER)
@UseGuards(JwtGuard, AbilitiesGuard)
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
    private readonly accountTxns: AccountTxnService,
  ) {}

  @Post()
  @CheckAbilities({ actions: ACTIONS.CREATE, subject: SUBJECTS.ACCOUNT })
  create(@Body() payload: CreateAccountDto, @xRC() rc: tRC) {
    return this.accountService.create(payload, rc);
  }

  @Get()
  @CheckAbilities({ actions: ACTIONS.READ, subject: SUBJECTS.ACCOUNT })
  //TODO: fix any
  getAccounts(@Query() query: GetAccountDto): any {
    return this.accountService.list(query);
  }

  @Get(':cuid')
  @CheckAbilities({ actions: ACTIONS.READ, subject: SUBJECTS.ACCOUNT })
  findOne(@Param('cuid') cuid: string) {
    return this.accountService.findOne(cuid);
  }

  @Put(':cuid')
  @CheckAbilities({ actions: ACTIONS.UPDATE, subject: SUBJECTS.ACCOUNT })
  update(
    @Param('cuid') cuid: string,
    @Body() payload: UpdateAccountDto,
    @xRC() rc: tRC,
  ) {
    return this.accountService.update(cuid, payload, rc);
  }

  @Delete(':cuid')
  @CheckAbilities({ actions: ACTIONS.DELETE, subject: SUBJECTS.ACCOUNT })
  delete(@Param('cuid') cuid: string, @xRC() rc: tRC) {
    return this.accountService.delete(cuid, rc);
  }

  @Get(':cuid/transactions')
  @CheckAbilities({ actions: ACTIONS.READ, subject: SUBJECTS.ACCOUNT })
  //TODO: fix any
  listTransactions(
    @Param('cuid') cuid: string,
    @Query() query: GetAccountTxnDto,
  ): any {
    return this.accountTxns.listByAccount(cuid, query);
  }
}
