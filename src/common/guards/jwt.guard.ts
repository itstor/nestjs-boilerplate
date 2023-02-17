import { ExecutionContext, mixin } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

import { ApiErrorMessage } from '../constants/api-error-message.constant';
import APIError from '../exceptions/api-error.exception';

export const JwtAuthGuard = (ignoreVerified = true) => {
  class JwtAuthGuardMixin extends AuthGuard('jwt') {
    constructor() {
      super();
    }

    canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest();

      const token = request.headers.authorization;

      if (!token) {
        throw APIError.fromMessage(ApiErrorMessage.TOKEN_NOT_FOUND_REQ);
      }

      return super.canActivate(context);
    }

    handleRequest(error: any, user: any, info: any) {
      if (error || info || !user) {
        if (info instanceof TokenExpiredError) {
          throw APIError.fromMessage(ApiErrorMessage.TOKEN_EXPIRED);
        } else if (info instanceof JsonWebTokenError) {
          throw APIError.fromMessage(ApiErrorMessage.TOKEN_INVALID);
        } else {
          throw APIError.fromMessage(ApiErrorMessage.TOKEN_NOT_FOUND_REQ);
        }
      }

      if (!ignoreVerified && user.isVerified === false) {
        throw APIError.fromMessage(ApiErrorMessage.USER_NOT_VERIFIED);
      }

      return user;
    }
  }

  return mixin(JwtAuthGuardMixin);
};
