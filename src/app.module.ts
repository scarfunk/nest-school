import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { School } from './entity/school.entity';
import { Admin } from './entity/admin.entity';
import { Student } from './entity/student.entity';
import { SchoolFeed } from './entity/school_feed.entity';
import { StudentSchoolSubscribe } from './entity/student_school_subscribe.entity';
import { StudentNewsFeed } from './entity/student_news_feed.entity';
import { AdminController } from './controller/admin.controller';
import { StudentController } from './controller/student.controller';
import { AdminService } from './service/admin.service';
import { AuthService } from './service/auth.service';
import { FeedService } from './service/feed.service';
import { SchoolService } from './service/school.service';
import { StudentService } from './service/student.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { NewFeedEventProducer } from './service/new-feed.event.producer';
import { NewFeedEventConsumer } from './service/new-feed.event.consumer';

const ENTITIES = [
  Student,
  Admin,
  School,
  SchoolFeed,
  StudentSchoolSubscribe,
  StudentNewsFeed,
];

@Module({
  imports: [...getRepoSetting(), EventEmitterModule.forRoot()],
  controllers: [AdminController, StudentController],
  providers: [
    AdminService,
    AuthService,
    FeedService,
    SchoolService,
    StudentService,
    NewFeedEventProducer,
    NewFeedEventConsumer,
  ],
})
export class AppModule {}

export function getRepoSetting() {
  return [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3399,
      username: 'root',
      password: 'root',
      database: 'classroom',
      entities: ENTITIES,
      synchronize: true,
      logging: true,
    }),
    TypeOrmModule.forFeature(ENTITIES),
  ];
}
