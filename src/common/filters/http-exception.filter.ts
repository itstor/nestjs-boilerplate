import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import * as dayjs from 'dayjs';
import { Response } from 'express';

import APIError, { IAPIError } from '../exceptions/api-error.exception';

@Catch(APIError, HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: APIError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const errorResponse = exception.getResponse() as IAPIError;
    const code = errorResponse.code ?? exception.name;
    const message = errorResponse.message;
    const stack = exception.cause?.stack ?? exception.stack;

    response.status(status).json({
      statusCode: status,
      code,
      message,
      timestamp: dayjs().toDate(),
      stack: process.env.NODE_ENV === 'development' ? stack : undefined,
    });
  }
}
