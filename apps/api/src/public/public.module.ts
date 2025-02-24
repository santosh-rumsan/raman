import { Module } from '@nestjs/common';
import { PrismaService } from '@rumsan/prisma';
import { PublicController } from './public.controller';
import { PublicService } from './public.service';

@Module({
  controllers: [PublicController],
  providers: [PublicService, PrismaService],
  exports: [PublicService],
})
export class PublicModule {}
