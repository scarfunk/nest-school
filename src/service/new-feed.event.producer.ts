import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class NewFeedEventProducer {
  constructor(private eventEmitter: EventEmitter2) {}

  produce(data: any) {
    this.eventEmitter.emit('news.created', data);
  }
}
