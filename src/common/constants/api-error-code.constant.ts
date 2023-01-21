import { HttpStatus } from '@nestjs/common';

export interface IApiErrorMessage {
  code: string;
  message: string;
  httpCode: HttpStatus;
}

export const ApiErrorCode = {
  NOT_LOGGED: {
    code: 'NOT_LOGGED',
    message: 'You are not logged in',
    httpCode: HttpStatus.UNAUTHORIZED,
  },
  TOKEN_EXPIRED: {
    code: 'TOKEN_EXPIRED',
    message: 'Token expired',
    httpCode: HttpStatus.UNAUTHORIZED,
  },
  USER_REGISTERED: {
    code: 'USER_REGISTERED',
    message: 'User already register with the same email',
    httpCode: HttpStatus.CONFLICT,
  },
  WRONG_EMAIL: {
    code: 'WRONG_EMAIL',
    message: 'User not found with the given email',
    httpCode: HttpStatus.UNAUTHORIZED,
  },
  WRONG_PASSWORD: {
    code: 'WRONG_PASSWORD',
    message: 'Wrong password',
    httpCode: HttpStatus.UNAUTHORIZED,
  },
  USER_NOT_FOUND: {
    code: 'USER_NOT_FOUND',
    message: 'User not found',
    httpCode: HttpStatus.NOT_FOUND,
  },
  USER_EXISTS: {
    code: 'USER_EXISTS',
    message: 'User already exists',
    httpCode: HttpStatus.CONFLICT,
  },
  USERNAME_EXISTS: {
    code: 'USERNAME_EXISTS',
    message: 'Username already exists',
    httpCode: HttpStatus.CONFLICT,
  },
} satisfies Record<string, IApiErrorMessage>;
