import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthsModule, RolesModule, UsersModule } from '@rumsan/user';
import { CatergoryModule } from '../category/category.module';
import { DemoModule } from '../demo/demo.module';
import { DepartmentModule } from '../department/department.module';
import { ExpenseModule } from '../expense/expense.module';
import { ListenerModule } from '../listeners/listener.module';
import { ProjectModule } from '../project/project.module';
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
    AuthsModule,
    RolesModule,
    UsersModule,
    DemoModule,
    ListenerModule,
    CatergoryModule,
    DepartmentModule,
    ProjectModule,
    ExpenseModule,
  ],
  controllers: [AppController],
  providers: [AppService, WebSocketService],
})
export class AppModule {}
