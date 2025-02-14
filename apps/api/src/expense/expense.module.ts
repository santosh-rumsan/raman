import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@rumsan/prisma';
import { GDriveService } from '../utils/gdrive.utils';
import { ExpenseController } from './expense.controller';
import { ExpenseService } from './expense.service';

@Module({
  controllers: [ExpenseController],
  providers: [ExpenseService, PrismaService, ConfigService, GDriveService],
})
export class ExpenseModule {}
