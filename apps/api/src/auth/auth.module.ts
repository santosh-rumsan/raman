import { Module } from '@nestjs/common';
import { PrismaService } from '@rumsan/prisma';
import { AuthsModule } from '@rumsan/user';
import { AuthsController } from './auths.controller';
import { AuthService } from './auths.service';
@Module({
  imports: [AuthsModule],
  controllers: [AuthsController],
  providers: [AuthService, PrismaService],
})
export class AuthModule {}
