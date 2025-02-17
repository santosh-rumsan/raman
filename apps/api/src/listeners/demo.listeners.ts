import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EVENTS } from '@rumsan/raman/constants/events';
import { tRC } from '@rumsan/sdk';
import { WebSocketService } from '../app/websocket.service';

@Injectable()
export class DemoListener {
  private otp: string;
  private readonly logger = new Logger(DemoListener.name);
  constructor(private ws: WebSocketService) {}

  @OnEvent(EVENTS.DEMO.PING)
  async hello(message: string, rc: tRC) {
    console.log('PING EVENT RECEIVED:', message);

    if (rc.clientId) {
      this.ws.sendToClient(rc.clientId, EVENTS.DEMO.PONG, {
        message: 'Please wait for a response via Websocket after 3 seconds',
      });
      await new Promise((resolve) => setTimeout(resolve, 3000));
      this.ws.sendToClient(rc.clientId, EVENTS.DEMO.PONG, {
        message,
        clientId: rc.clientId,
        serverTime: new Date().toISOString(),
      });
    }
  }
}
