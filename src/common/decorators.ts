import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { decode } from 'jsonwebtoken';
import { META_ROLE_TYPE, TOKEN_HEADER_KEY } from './constants';
import { AuthorizationType } from './enums';

export const ApiRole = (types: AuthorizationType) =>
  SetMetadata(META_ROLE_TYPE, types);

export const DecodedAccToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return decode(request.headers[TOKEN_HEADER_KEY]);
  },
);
