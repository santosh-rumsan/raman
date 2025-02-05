import {Injectable, Logger} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {OnEvent} from '@nestjs/event-emitter';
import {tRC} from '@rumsan/sdk';
import {EVENTS} from '@workspace/sdk/events';
import {WebSocketService} from '../app/websocket.service';

@Injectable()
export class DemoListener {
  private otp: string;
  private readonly logger = new Logger(DemoListener.name);
  constructor(
    private config: ConfigService,
    private ws: WebSocketService,
  ) {}

  @OnEvent(EVENTS.DEMO.PING)
  async hello(message: string, rc: tRC) {
    console.log('PING EVENT RECEIVED:', message);

    if (rc.clientId) {
      this.ws.sendToClient(rc.clientId, EVENTS.DEMO.PONG, {
        message,
        clientId: rc.clientId,
        serverTime: new Date().toISOString(),
      });
    }
  }
}
