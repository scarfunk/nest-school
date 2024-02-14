import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { TypeORMError } from 'typeorm';
import { Response } from 'express';

@Catch(TypeORMError)
export class TypeORMExceptionFilter implements ExceptionFilter {
  catch(error: TypeORMError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const responseStatus = HttpStatus.NOT_FOUND;
    if (error.name === 'EntityNotFoundError') {
      response.status(responseStatus).json({
        statusCode: responseStatus,
        timestamp: new Date().toISOString(),
        path: ctx.getRequest().url,
      });
    } else {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
