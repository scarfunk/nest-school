import { Injectable, UnauthorizedException } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';

type TokenData = { id: number; isAdmin: boolean };

@Injectable()
export class AuthService {
  private jwtKey = 'secretKey';
  private TOKEN_EXPIRE_MIN = 60; // 1시간
  constructor() {}

  createTokens(data: TokenData) {
    return this.makeToken(this.TOKEN_EXPIRE_MIN, data);
  }

  verifyToken(token: string) {
    try {
      return verify(token, this.jwtKey);
    } catch (e) {
      // 토큰 검증 실패시는 401 로 로그아웃 시킨다
      throw new UnauthorizedException('토큰만료');
    }
  }

  decodeToken(token: string) {
    return verify(token, this.jwtKey);
  }

  private makeToken(MIN: number, data: TokenData): string {
    return sign(data, this.jwtKey, {
      algorithm: 'HS256',
      expiresIn: MIN * 60,
    });
  }
}
