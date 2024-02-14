import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentNewsFeed } from '../entity/student_news_feed.entity';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class NewFeedEventConsumer {
  constructor(
    @InjectRepository(StudentNewsFeed)
    private readonly newsRepository: Repository<StudentNewsFeed>,
  ) {}

  // 이벤트를 받아서 처리하는 컨슈머.
  // request-scope 가 아니라, producer, consumer 를 나누어야 함. https://stackoverflow.com/questions/74301384/call-1-function-twice-with-event-emitter-with-nestjs-problem
  @OnEvent('news.created')
  async handleNewsCreatedEvent(payload: any) {
    console.log('New feed created', payload);
    const news = this.newsRepository.create({
      student: payload.student,
      feed: payload.savedFeed,
    });
    await this.newsRepository.save(news);
  }
}
