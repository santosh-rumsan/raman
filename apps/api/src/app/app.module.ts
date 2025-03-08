import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RolesModule, UsersModule } from '@rumsan/user';
import { AuthModule } from 'src/auth/auth.module';
import { AccountTxnModule } from '../account-txn/account-txn.module';
import { AccountModule } from '../account/account.module';
import { CatergoryModule } from '../category/category.module';
import { DemoModule } from '../demo/demo.module';
import { DepartmentModule } from '../department/department.module';
import { ExpenseModule } from '../expense/expense.module';
import { InvoiceModule } from '../invoice/invoice.module';
import { ListenerModule } from '../listeners/listener.module';
import { MiscModule } from '../misc/misc.module';
import { ProjectModule } from '../project/project.module';
import { PublicModule } from '../public/public.module';
import { ReportingModule } from '../reporting/reporting.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebSocketService } from './websocket.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot({
      maxListeners: 10,
      ignoreErrors: false,
    }),
    AuthModule,
    RolesModule,
    UsersModule,
    DemoModule,
    ListenerModule,
    AccountModule,
    AccountTxnModule,
    CatergoryModule,
    DepartmentModule,
    ProjectModule,
    PublicModule,
    ExpenseModule,
    InvoiceModule,
    MiscModule,
    ReportingModule,
  ],
  controllers: [AppController],
  providers: [AppService, WebSocketService],
})
export class AppModule {}
