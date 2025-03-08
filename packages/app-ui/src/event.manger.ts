import { EventEmitter } from 'events';

class EventManager {
  private static instance: EventManager;
  private eventEmitter: EventEmitter;

  private constructor() {
    this.eventEmitter = new EventEmitter();
  }

  public static getInstance(): EventManager {
    if (!EventManager.instance) {
      EventManager.instance = new EventManager();
    }

    return EventManager.instance;
  }

  public on(event: string, listener: (...args: any[]) => void): void {
    this.eventEmitter.on(event, listener);
  }

  public emit(event: string, ...args: any[]): void {
    this.eventEmitter.emit(event, ...args);
  }
}

const _AppEventManager = EventManager.getInstance();

export const AppEventManager = new EventEmitter();
