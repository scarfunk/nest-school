import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { META_ROLE_TYPE, TOKEN_HEADER_KEY } from './constants';
import { Reflector } from '@nestjs/core';
import { decode } from 'jsonwebtoken';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const acc_token = request.headers[TOKEN_HEADER_KEY];
    this.authService.verifyToken(acc_token);
    return true;
  }
}

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const apiRole = this.reflector.get(META_ROLE_TYPE, context.getHandler());
    const request = context.switchToHttp().getRequest();
    const isAdmin = decode(request.headers[TOKEN_HEADER_KEY])['isAdmin'];
    if (apiRole === 'ADMIN' && !isAdmin) {
      return false;
    }
    return true;
  }
}
