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
  OLD_PASSWORD_REQUIRED: {
    code: 'OLD_PASSWORD_REQUIRED',
    message: 'Old password is required',
    httpCode: HttpStatus.BAD_REQUEST,
  },
  WRONG_EMAIL_USERNAME: {
    code: 'WRONG_EMAIL_USERNAME',
    message: 'User not found with the given email or username',
    httpCode: HttpStatus.UNAUTHORIZED,
  },
  USER_NOT_FOUND: {
    code: 'USER_NOT_FOUND',
    message: 'User not found',
    httpCode: HttpStatus.NOT_FOUND,
  },
  USER_NOT_VERIFIED: {
    code: 'USER_NOT_VERIFIED',
    message: 'User is not verified, please verify your email',
    httpCode: HttpStatus.UNAUTHORIZED,
  },
  USER_REGISTERED_WITH_ANOTHER_METHOD: {
    code: 'USER_REGISTERED_WITH_ANOTHER_METHOD',
    message:
      'User is already registered with another method. You can link this account in your profile',
    httpCode: HttpStatus.UNAUTHORIZED,
  },
  USER_PASSWORD_NOT_SET: {
    code: 'USER_PASSWORD_NOT_SET',
    message:
      'User registered with another method, please login with that method. Set password in your profile, if you want to login with password',
    httpCode: HttpStatus.UNAUTHORIZED,
  },
  USERNAME_EXISTS: {
    code: 'USERNAME_EXISTS',
    message: 'Username already exists',
    httpCode: HttpStatus.CONFLICT,
  },
  USERNAME_SAME_AS_OLD: {
    code: 'USERNAME_SAME_AS_OLD',
    message: 'New username is same as old username',
    httpCode: HttpStatus.BAD_REQUEST,
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
  EMAIL_SAME_AS_OLD: {
    code: 'EMAIL_SAME_AS_OLD',
    message: 'New email is same as old email',
    httpCode: HttpStatus.BAD_REQUEST,
  },
  EMAIL_ALREADY_VERIFIED: {
    code: 'EMAIL_ALREADY_VERIFIED',
    message: 'Email already verified',
    httpCode: HttpStatus.BAD_REQUEST,
  },
  INVALID_OTP: {
    code: 'INVALID_OTP',
    message: 'Invalid OTP',
    httpCode: HttpStatus.UNAUTHORIZED,
  },
  INVALID_OTP_TOKEN: {
    code: 'INVALID_OTP',
    message: 'Invalid OTP token',
    httpCode: HttpStatus.UNAUTHORIZED,
  },
  VERIFY_OTP_FIRST: {
    code: 'VERIFY_OTP_FIRST',
    message: 'Please verify your otp first',
    httpCode: HttpStatus.UNAUTHORIZED,
  },
  REQ_OTP_FIRST: {
    code: 'REQ_OTP_FIRST',
    message: 'Please request otp first',
    httpCode: HttpStatus.UNAUTHORIZED,
  },
  RESEND_OTP_NOT_ALLOWED: {
    code: 'RESEND_OTP_NOT_ALLOWED',
    message: 'You can resend OTP after 30 seconds',
    httpCode: HttpStatus.TOO_MANY_REQUESTS,
  },
  OPERATION_FAILED: {
    code: 'OPERATION_FAILED',
    message: 'Operation failed',
    httpCode: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  OAUTH_INVALID_STATE: {
    code: 'INVALID_STATE',
    message: 'Invalid state',
    httpCode: HttpStatus.BAD_REQUEST,
  },
  OAUTH_INVALID_CODE: {
    code: 'INVALID_CODE',
    message: 'Invalid code',
    httpCode: HttpStatus.BAD_REQUEST,
  },
  OAUTH_INVALID_USER_DATA: {
    code: 'INVALID_USER_DATA',
    message: "Can't use this account to login",
    httpCode: HttpStatus.BAD_REQUEST,
  },
  OAUTH_NO_CODE: {
    code: 'NO_CODE',
    message: 'No code provided',
    httpCode: HttpStatus.BAD_REQUEST,
  },
  OAUTH_NO_TOKENS: {
    code: 'NO_TOKEN',
    message: 'No token provided',
    httpCode: HttpStatus.BAD_REQUEST,
  },
  OAUTH_USER_ALREADY_REGISTERED: {
    code: 'USER_ALREADY_REGISTERED',
    message:
      'User already registered with another method. You can link this account in your profile',
    httpCode: HttpStatus.CONFLICT,
  },
  OAUTH_SOCIAL_ACCOUNT_ALREADY_LINKED: {
    code: 'SOCIAL_ACCOUNT_ALREADY_LINKED',
    message: 'Social account already linked',
    httpCode: HttpStatus.CONFLICT,
  },
} as const satisfies Record<string, IApiErrorMessage>;
