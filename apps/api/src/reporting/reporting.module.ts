import { Module } from '@nestjs/common';
import { PrismaService } from '@rumsan/prisma';
import { ReportingController } from './reporting.controller';
import { ReportingService } from './reporting.service';

@Module({
  controllers: [ReportingController],
  providers: [ReportingService, PrismaService],
})
export class ReportingModule {}
