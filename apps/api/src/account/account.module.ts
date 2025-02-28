import { Module } from '@nestjs/common';
import { PrismaService } from '@rumsan/prisma';
import { AccountTxnService } from '../account-txn/account-txn.service';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';

@Module({
  controllers: [AccountController],
  providers: [AccountService, PrismaService, AccountTxnService],
})
export class AccountModule {}
