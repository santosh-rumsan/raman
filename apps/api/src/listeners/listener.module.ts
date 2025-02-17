import { Module } from '@nestjs/common';
import { PrismaService } from '@rumsan/prisma';
import { WebSocketService } from '../app/websocket.service';
import { EmailModule } from '../email/email.module';
import { GDriveService } from '../utils/gdrive.utils';
import { AuthListener } from './auth.listener';
import { DemoListener } from './demo.listeners';
import { ExpenseListener } from './expense.listener';
import { InvoiceListener } from './invoice.listener';

@Module({
  imports: [EmailModule],
  providers: [
    DemoListener,
    AuthListener,
    WebSocketService,
    ExpenseListener,
    InvoiceListener,
    PrismaService,
    GDriveService,
  ],
})
export class ListenerModule {}
