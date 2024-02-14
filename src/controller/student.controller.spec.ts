import { Test, TestingModule } from '@nestjs/testing';
import { StudentController } from './student.controller';
import { AuthService } from '../service/auth.service';
import { getRepoSetting } from '../app.module';
import { StudentService } from '../service/student.service';
import { decode } from 'jsonwebtoken';
import { AdminController } from './admin.controller';
import { AdminService } from '../service/admin.service';
import { SchoolService } from '../service/school.service';
import { FeedService } from '../service/feed.service';
import { truncateDB } from '../common/utils';
import { Student } from '../entity/student.entity';
import { NewFeedEventProducer } from '../service/new-feed.event.producer';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { sleep } from '../../test/util';
import { NewFeedEventConsumer } from '../service/new-feed.event.consumer';

describe('studentController', () => {
  let app: TestingModule;
  let studentController: StudentController;
  let adminController: AdminController;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [...getRepoSetting(), EventEmitterModule.forRoot()],
      controllers: [StudentController, AdminController],
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
    // 이벤트 큐를 위한 초기화 필요.
    await app.init();
    studentController = app.get<StudentController>(StudentController);
    adminController = app.get<AdminController>(AdminController);
    // truncate all table
    await truncateDB(app, Student, 'classroom');
  });

  afterAll(async () => {
    await app.close();
  });

  describe('UserController', () => {
    it('유저 가입 > 토큰 발급"', async () => {
      const res = await studentController.registerUser({ name: 'test' });
      expect(res).toBeDefined();
    });

    describe('구독', () => {
      let school;
      beforeEach(async () => {
        const admin_token = await adminController.registerUser({
          name: 'test',
        });
        const admin_payload = decode(admin_token);
        school = await adminController.makeSchool(
          { name: 'test', location: '서울' },
          admin_payload,
        );
        await adminController.postFeed(
          { content: 'hello world!' },
          admin_payload,
        );
      });

      it('학교 생성 후 학생이 구독 > 확인', async () => {
        // given
        const token = await studentController.registerUser({ name: 'test' });
        const student_payload = decode(token);

        // when
        const res = await studentController.subscribeSchool(
          {
            schoolId: school.id,
          },
          student_payload,
        );
        const res2 = await studentController.listSchools(student_payload);
        // then
        expect(res).toBeDefined();
        expect(res2.length).toBe(1);
      });

      it('학교 생성 후 학생이 구독 후 > 해지 > 확인', async () => {
        // given
        const token = await studentController.registerUser({ name: 'test' });
        const student_payload = decode(token);

        await studentController.subscribeSchool(
          {
            schoolId: school.id,
          },
          student_payload,
        );
        // when

        const res = await studentController.unsubscribeSchool(
          {
            schoolId: school.id,
          },
          student_payload,
        );
        const res2 = await studentController.listSchools(student_payload);
        // then
        expect(res).toBeDefined();
        expect(res2.length).toBe(0);
      });

      it('학교 생성 후 학생이 구독 후 > 피드 확인', async () => {
        // given
        const token = await studentController.registerUser({ name: 'test' });
        const student_payload = decode(token);

        await studentController.subscribeSchool(
          {
            schoolId: school.id,
          },
          student_payload,
        );
        // when
        const res = await studentController.feedBySchool(
          school.id,
          student_payload,
        );
        // then
        expect(res.length).toBe(1);
      });
    });

    describe('뉴스피드', () => {
      let school;
      let admin_payload;
      beforeEach(async () => {
        const admin_token = await adminController.registerUser({
          name: 'test',
        });
        admin_payload = decode(admin_token);
        school = await adminController.makeSchool(
          { name: 'test', location: '서울' },
          admin_payload,
        );
        await adminController.postFeed(
          { content: 'hello world!' },
          admin_payload,
        );
      });

      it('학생이 구독 > 어드민 피드 생성 > 확인', async () => {
        // given
        const token = await studentController.registerUser({ name: 'test' });
        const student_payload = decode(token);
        await studentController.subscribeSchool(
          {
            schoolId: school.id,
          },
          student_payload,
        );
        await adminController.postFeed(
          { content: 'hello world! after sub' },
          admin_payload,
        );
        // when
        const schoolList = await studentController.listSchools(student_payload);
        const feedList = await studentController.feedBySchool(
          school.id,
          student_payload,
        );
        // 컨슘 시간을 위한 sleep
        await sleep(1000);
        const newsList = await studentController.newsFeed(student_payload);
        // then
        expect(schoolList.length).toBe(1);
        expect(feedList.length).toBe(2);
        expect(newsList.length).toBe(1);
      });
    });
  });
});
