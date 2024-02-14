import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../service/auth.service';
import { getRepoSetting } from '../app.module';
import { AdminController } from './admin.controller';
import { AdminService } from '../service/admin.service';
import { decode } from 'jsonwebtoken';
import { SchoolService } from '../service/school.service';
import { FeedService } from '../service/feed.service';
import { StudentService } from '../service/student.service';
import { truncateDB } from '../common/utils';
import { Student } from '../entity/student.entity';
import { NewFeedEventProducer } from '../service/new-feed.event.producer';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { NewFeedEventConsumer } from '../service/new-feed.event.consumer';

describe('admin', () => {
  let controller: AdminController;
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [...getRepoSetting(), EventEmitterModule.forRoot()],
      controllers: [AdminController],
      providers: [
        AdminService,
        AuthService,
        SchoolService,
        FeedService,
        StudentService,
        NewFeedEventProducer,
        NewFeedEventConsumer,
      ],
    }).compile();
    controller = app.get<AdminController>(AdminController);
    // truncate all table
    await truncateDB(app, Student, 'classroom');
  });

  afterAll(async () => {
    await app.close();
  });

  describe('ctr', () => {
    it('어드민 가입 > 토큰 발급"', async () => {
      const res = await controller.registerUser({ name: 'test' });
      expect(res).toBeDefined();
    });

    it('학교 생성', async () => {
      // given
      const token = await controller.registerUser({ name: 'test' });
      const payload = decode(token);
      // when
      const res = await controller.makeSchool(
        { name: 'test', location: '서울' },
        payload,
      );
      // then
      expect(res).toBeDefined();
    });

    it('학교 피드 생성', async () => {
      // given
      const token = await controller.registerUser({ name: 'test' });
      const payload = decode(token);
      await controller.makeSchool({ name: 'test', location: '서울' }, payload);
      // when
      const res = await controller.postFeed(
        { content: 'hello world!' },
        payload,
      );
      // then
      expect(res).toBeDefined();
    });

    it('학교 피드 수정', async () => {
      // given
      const token = await controller.registerUser({ name: 'test' });
      const payload = decode(token);
      await controller.makeSchool({ name: 'test', location: '서울' }, payload);
      const feed = await controller.postFeed(
        { content: 'hello world!' },
        payload,
      );
      // when
      const res = await controller.updateFeed(
        { id: feed.id, content: 'fixed! hello world!' },
        payload,
      );
      // then
      expect(res).toBeDefined();
    });

    it('학교 피드 삭제', async () => {
      // given
      const token = await controller.registerUser({ name: 'test' });
      const payload = decode(token);
      await controller.makeSchool({ name: 'test', location: '서울' }, payload);
      const feed = await controller.postFeed(
        { content: 'hello world!' },
        payload,
      );
      // when
      const res = await controller.deleteFeed({ id: feed.id }, payload);
      // then
      expect(res).toBeDefined();
    });
  });
});
