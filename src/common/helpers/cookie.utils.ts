import { CookieOptions } from 'express';

export class CookieUtils {
  public static getCookieSettings(expires: Date): CookieOptions {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires,
      sameSite: 'strict',
      signed: true,
    };
  }
}
