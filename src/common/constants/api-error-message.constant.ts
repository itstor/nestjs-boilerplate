import { HttpStatus } from '@nestjs/common';

export interface IApiErrorMessage {
  code: string;
  message: string;
  httpCode: HttpStatus;
}

export const ApiErrorMessage = {
  INTERNAL_SERVER_ERROR: {
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Something went wrong',
    httpCode: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  UNAUTHORIZED: {
    code: 'UNAUTHORIZED',
    message: 'You are not logged in',
    httpCode: HttpStatus.UNAUTHORIZED,
  },
  TOKEN_EXPIRED: {
    code: 'TOKEN_EXPIRED',
    message: 'Your token has expired, please login again',
    httpCode: HttpStatus.UNAUTHORIZED,
  },
  TOKEN_INVALID: {
    code: 'TOKEN_INVALID',
    message: 'Your token is invalid, please login again',
    httpCode: HttpStatus.UNAUTHORIZED,
  },
  TOKEN_REVOKED: {
    code: 'TOKEN_REVOKED',
    message: 'Your token has been revoked, please login again',
    httpCode: HttpStatus.UNAUTHORIZED,
  },
  TOKEN_NOT_FOUND_REQ: {
    code: 'TOKEN_NOT_FOUND',
    message: 'Please, provide a token',
    httpCode: HttpStatus.UNAUTHORIZED,
  },
  USER_EMAIL_REGISTERED: {
    code: 'USER_EMAIL_REGISTERED',
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
  USERNAME_EXISTS: {
    code: 'USERNAME_EXISTS',
    message: 'Username already exists',
    httpCode: HttpStatus.CONFLICT,
  },
  EMAIL_EXISTS: {
    code: 'EMAIL_EXISTS',
    message: 'Email already exists',
    httpCode: HttpStatus.CONFLICT,
  },
  EMAIL_NOT_SENT: {
    code: 'EMAIL_NOT_SENT',
    message: 'Cannot send email',
    httpCode: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  INVALID_OTP: {
    code: 'INVALID_OTP',
    message: 'Invalid OTP',
    httpCode: HttpStatus.UNAUTHORIZED,
  },
  VERIFY_OTP_FIRST: {
    code: 'VERIFY_OTP_FIRST',
    message: 'Please verify your otp first',
    httpCode: HttpStatus.UNAUTHORIZED,
  },
} as const satisfies Record<string, IApiErrorMessage>;
