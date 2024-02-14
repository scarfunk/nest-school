import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('토큰 발행 성공', () => {
    expect(service.createTokens({ id: 1, isAdmin: false })).toBeDefined();
  });

  it('토큰 발행 성공 > 검증 성공', () => {
    const token = service.createTokens({ id: 1, isAdmin: false });
    expect(service.verifyToken(token)).toBeDefined();
  });

  it('임의 토큰 > 검증 실패', () => {
    const token = 'random';
    expect(() => service.verifyToken(token)).toThrowError(
      UnauthorizedException,
    );
  });
});
