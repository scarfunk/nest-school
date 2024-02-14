import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getRepoSetting } from './../src/app.module';
import { truncateDB } from '../src/common/utils';
import { Student } from '../src/entity/student.entity';
import { setAppUse } from '../src/main';
import { TOKEN_HEADER_KEY } from '../src/common/constants';
import { sleep } from './util';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AdminController } from '../src/controller/admin.controller';
import { StudentController } from '../src/controller/student.controller';
import { AdminService } from '../src/service/admin.service';
import { AuthService } from '../src/service/auth.service';
import { FeedService } from '../src/service/feed.service';
import { SchoolService } from '../src/service/school.service';
import { StudentService } from '../src/service/student.service';
import { NewFeedEventProducer } from '../src/service/new-feed.event.producer';
import { NewFeedEventConsumer } from '../src/service/new-feed.event.consumer';

describe('(e2e)', () => {
  let app: INestApplication;
  let adminToken;
  let studentToken;
  let student2Token;
  let schoolId;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
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
    }).compile();
    app = module.createNestApplication();
    setAppUse(app);
    await app.init();
    // truncate all table
    await truncateDB(app, Student, 'classroom');
  });

  afterAll(async () => {
    await app.close();
  });

  it('학생, 관리자 가입', async () => {
    const res = await request(app.getHttpServer())
      .post('/admin/register')
      .send({ name: 'admin' });
    expect(res.status).toEqual(201);
    adminToken = res.text;

    const res2 = await request(app.getHttpServer())
      .post('/student/register')
      .send({ name: 'student' });
    expect(res2.status).toEqual(201);
    studentToken = res2.text;

    const res3 = await request(app.getHttpServer())
      .post('/student/register')
      .send({ name: 'student2' });
    expect(res3.status).toEqual(201);
    student2Token = res3.text;
  });

  it('ERR: 관리자) 인증없음 학교 생성 불가', async () => {
    const res = await request(app.getHttpServer())
      .post('/admin/make-school')
      .send({ name: 'school', location: '서울' });
    expect(res.status).toEqual(401);
  });

  it('ERR: 학생) 학교 생성 불가', async () => {
    const res = await request(app.getHttpServer())
      .post('/admin/make-school')
      .send({ name: 'school', location: '서울' })
      .set(TOKEN_HEADER_KEY, `${studentToken}`);
    expect(res.status).toEqual(403);
  });

  it('관리자) 학교 생성', async () => {
    const res = await request(app.getHttpServer())
      .post('/admin/make-school')
      .send({ name: 'school', location: '서울' })
      .set(TOKEN_HEADER_KEY, `${adminToken}`);
    expect(res.status).toEqual(201);
    schoolId = res.body.id;
  });

  it('관리자) 학교 피드 추가', async () => {
    const res = await request(app.getHttpServer())
      .post('/admin/post-feed')
      .send({ content: '공지입니다' })
      .set(TOKEN_HEADER_KEY, `${adminToken}`);
    expect(res.status).toEqual(201);
  });

  it('ERR: 관리자) 학교 중복 생성 불가', async () => {
    const res = await request(app.getHttpServer())
      .post('/admin/make-school')
      .send({ name: 'school', location: '서울' })
      .set(TOKEN_HEADER_KEY, `${adminToken}`);
    expect(res.status).toEqual(400);
  });

  it('학생) 학교 구독', async () => {
    const res = await request(app.getHttpServer())
      .post('/student/subscribe-school')
      .send({ schoolId })
      .set(TOKEN_HEADER_KEY, `${studentToken}`);
    expect(res.status).toEqual(201);

    const res2 = await request(app.getHttpServer())
      .post('/student/subscribe-school')
      .send({ schoolId })
      .set(TOKEN_HEADER_KEY, `${student2Token}`);
    expect(res2.status).toEqual(201);
  });

  it('ERR: 학생) 미존재 학교 구독', async () => {
    const res = await request(app.getHttpServer())
      .post('/student/subscribe-school')
      .send({ schoolId: 9999 })
      .set(TOKEN_HEADER_KEY, `${studentToken}`);
    expect(res.status).toEqual(404);
  });

  it('ERR: 학생) 학교 구독 중복 불가', async () => {
    const res = await request(app.getHttpServer())
      .post('/student/subscribe-school')
      .send({ schoolId })
      .set(TOKEN_HEADER_KEY, `${studentToken}`);
    expect(res.status).toEqual(400);
  });

  it('학생) 학교 구독 해제', async () => {
    const res = await request(app.getHttpServer())
      .delete('/student/unsubscribe-school')
      .send({ schoolId })
      .set(TOKEN_HEADER_KEY, `${student2Token}`);
    expect(res.status).toEqual(200);
  });

  it('학생) 구독 학교 리스트', async () => {
    const res = await request(app.getHttpServer())
      .get('/student/schools')
      .set(TOKEN_HEADER_KEY, `${studentToken}`);
    expect(res.status).toEqual(200);
    expect(res.body).toHaveLength(1);

    const res2 = await request(app.getHttpServer())
      .get('/student/schools')
      .set(TOKEN_HEADER_KEY, `${student2Token}`);
    expect(res2.status).toEqual(200);
    expect(res2.body).toHaveLength(0);
  });

  it('학생) 학교 피드 보기', async () => {
    const res = await request(app.getHttpServer())
      .get(`/student/feed-by-school/${schoolId}`)
      .set(TOKEN_HEADER_KEY, `${studentToken}`);
    expect(res.status).toEqual(200);
    expect(res.body).toHaveLength(1);
  });

  it('ERR: 학생) 구독 해지한 학교 피드 보기', async () => {
    const res = await request(app.getHttpServer())
      .get(`/student/feed-by-school/${schoolId}`)
      .set(TOKEN_HEADER_KEY, `${student2Token}`);
    expect(res.status).toEqual(400);
  });

  it('관리자) 학교 피드 추가', async () => {
    const res = await request(app.getHttpServer())
      .post('/admin/post-feed')
      .send({ content: '학교뉴스1' })
      .set(TOKEN_HEADER_KEY, `${adminToken}`);
    expect(res.status).toEqual(201);
  });

  it('학생) 학교 피드 + 내 뉴스피드 보기', async () => {
    await sleep(1000);
    const res = await request(app.getHttpServer())
      .get(`/student/feed-by-school/${schoolId}`)
      .set(TOKEN_HEADER_KEY, `${studentToken}`);
    expect(res.status).toEqual(200);
    expect(res.body).toHaveLength(2);

    const res2 = await request(app.getHttpServer())
      .get(`/student/news-feed`)
      .set(TOKEN_HEADER_KEY, `${studentToken}`);
    expect(res2.status).toEqual(200);
    expect(res2.body).toHaveLength(1);
  });

  it('학생) 학교 구독 해지 후 > 피드 추가후 > 내 뉴스 피드 보기', async () => {
    const res = await request(app.getHttpServer())
      .delete('/student/unsubscribe-school')
      .send({ schoolId })
      .set(TOKEN_HEADER_KEY, `${studentToken}`);
    expect(res.status).toEqual(200);
    const res1 = await request(app.getHttpServer())
      .post('/admin/post-feed')
      .send({ content: '학교뉴스2' })
      .set(TOKEN_HEADER_KEY, `${adminToken}`);
    expect(res1.status).toEqual(201);
    const res2 = await request(app.getHttpServer())
      .get(`/student/news-feed`)
      .set(TOKEN_HEADER_KEY, `${studentToken}`);
    expect(res2.status).toEqual(200);
    expect(res2.body).toHaveLength(1);
  });
});
