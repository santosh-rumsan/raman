import { Module } from '@nestjs/common';
import { PrismaService } from '@rumsan/prisma';
import { MiscController } from './misc.controller';
import { MiscService } from './misc.service';

@Module({
  controllers: [MiscController],
  providers: [MiscService, PrismaService],
  exports: [MiscService],
})
export class MiscModule {}
