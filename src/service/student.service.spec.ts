import { StudentService } from './student.service';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { Student } from '../entity/student.entity';
import { StudentNewsFeed } from '../entity/student_news_feed.entity';

describe('StudentService', () => {
  let service: StudentService;
  let repository: Repository<Student>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentService,
        AuthService,
        {
          provide: getRepositoryToken(Student),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(StudentNewsFeed),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<StudentService>(StudentService);
    repository = module.get(getRepositoryToken(Student));
  });

  it('유저 가입 > 토큰 발급', async () => {
    // given
    repository.save = jest.fn().mockResolvedValue({ id: 1 });
    // when
    const token = await service.create({ name: 'test' });
    // then
    expect(repository.save).toBeCalledWith({ name: 'test' });
    expect(token).toBeDefined();
  });
});
