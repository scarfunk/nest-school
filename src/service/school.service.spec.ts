import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { School } from '../entity/school.entity';
import { SchoolService } from './school.service';
import { StudentSchoolSubscribe } from '../entity/student_school_subscribe.entity';
import { StudentService } from './student.service';

describe('school srv', () => {
  let service: SchoolService;
  let schoolRepo: Repository<School>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SchoolService,
        {
          provide: AdminService,
          useValue: {
            findAdmin: jest.fn().mockResolvedValue({ id: 1 }),
          },
        },
        {
          provide: StudentService,
          useValue: {},
        },
        {
          provide: getRepositoryToken(School),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(StudentSchoolSubscribe),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<SchoolService>(SchoolService);
    schoolRepo = module.get(getRepositoryToken(School));
  });

  it('학교생성.', async () => {
    // given
    schoolRepo.create = jest.fn().mockResolvedValue({ id: 1 });
    schoolRepo.save = jest.fn().mockResolvedValue({ id: 1 });
    schoolRepo.findOne = jest.fn().mockResolvedValue(null);
    // when
    const resp = await service.makeSchool({
      name: 'test',
      location: 'seoul',
      adminId: 1,
    });
    // then
    expect(resp).toBeDefined();
  });
});
