import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AdminService } from './admin.service';
import { Admin } from '../entity/admin.entity';

describe('AdminService', () => {
  let service: AdminService;
  let adminRepo: Repository<Admin>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        AuthService,
        {
          provide: getRepositoryToken(Admin),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
    adminRepo = module.get(getRepositoryToken(Admin));
  });

  it('관리자 가입 > 토큰 발급', async () => {
    // given
    adminRepo.save = jest.fn().mockResolvedValue({ id: 1 });
    // when
    const token = await service.create({ name: 'test' });
    // then
    expect(token).toBeDefined();
  });
});
