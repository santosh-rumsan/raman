import { Module } from '@nestjs/common';
import { PrismaService } from '@rumsan/prisma';
import { AccountTxnAppController } from './account-txn-app.controller';
import { AccountTxnController } from './account-txn.controller';
import { AccountTxnService } from './account-txn.service';

@Module({
  controllers: [AccountTxnController, AccountTxnAppController],
  providers: [AccountTxnService, PrismaService],
})
export class AccountTxnModule {}
