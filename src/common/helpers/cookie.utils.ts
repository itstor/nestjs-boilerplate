import { CookieOptions, Request } from 'express';

import { CookieName } from '../constants/cookie-name.constant';

export class CookieUtils {
  public static getCookieSettings(expires: Date): CookieOptions {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires,
      sameSite: 'strict',
    };
  }

  public static getRefreshTokenCookie(req: Request) {
    return req.cookies[CookieName.REFRESH_TOKEN];
  }
}
