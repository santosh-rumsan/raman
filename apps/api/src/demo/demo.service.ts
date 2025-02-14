import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENTS } from '@rumsan/raman/constants/events';
import { tRC } from '@rumsan/sdk';
import { allCaps } from '../utils/misc';

@Injectable()
export class DemoService {
  constructor(private readonly eventEmitter: EventEmitter2) {}
  helloWorld(rc: tRC) {
    this.eventEmitter.emit(EVENTS.DEMO.PING, 'Hello from WS', rc);
    return {
      message: allCaps('Hello') + ' from API',
      serverTime: new Date().toISOString(),
    };
  }
}
