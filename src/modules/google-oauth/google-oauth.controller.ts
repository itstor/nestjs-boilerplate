import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiFoundResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';

import { ApiErrorMessage } from '@/common/constants/api-error-message.constant';
import { CookieName } from '@/common/constants/cookie-name.constant';
import { LoggedUser } from '@/common/decorators/logged-user.decorator';
import { UseAuth } from '@/common/decorators/use-auth.decorator';
import APIError from '@/common/exceptions/api-error.exception';
import { CookieUtils } from '@/common/helpers/cookie.utils';
import { Base64QueryParsePipe } from '@/common/pipes/base64-query-parse.pipe';
import { JsonQueryParsePipe } from '@/common/pipes/json-query-parse.pipe';
import { IOAuthState } from '@/common/types/interfaces/oauth-state.interface';
import { User } from '@/entities/user.entity';

import { GoogleOauthService } from './google-oauth.service';

@Controller({
  path: 'auth/oauth/google',
  version: '1',
})
@ApiTags('Google OAuth2')
export class GoogleOauthController {
  constructor(private readonly gOauthService: GoogleOauthService) {}

  @Get()
  @ApiQuery({
    name: 'state',
    required: false,
    description:
      'State in JSON format and encoded using Base64. This state will be returned to the client after the login process is completed.',
  })
  @ApiQuery({
    name: 'redirect',
    required: false,
    description:
      'If this parameter is set to true, the client will be redirected to previous page after the login process is completed. Default value is false.',
  })
  @ApiOperation({
    operationId: 'Login with Google',
    description: 'This endpoint will redirect the client to Google login page.',
  })
  @ApiFoundResponse({
    description: 'Redirect to Google login page',
  })
  async login(
    @Req() req: Request,
    @Res() res: Response,
    @Query('state') state?: string,
    @Query('redirect') redirect?: boolean,
  ) {
    const refferer = req.headers.referer;

    const result = await this.gOauthService.login(state, refferer, redirect);

    if (result.isErr()) {
      throw APIError.fromMessage(ApiErrorMessage.OAUTH_INVALID_STATE);
    }

    const url = result.value;

    res.redirect(url);
  }

  @Get('callback')
  async callback(
    @Res({ passthrough: true }) res: Response,
    @Query('code') code: string,
    @Query('state', new Base64QueryParsePipe(), new JsonQueryParsePipe())
    state: IOAuthState,
  ) {
    const result = await this.gOauthService.callback(code, state);

    if (result.isErr()) {
      const error = result.error;

      switch (error.name) {
        case 'INVALID_STATE':
          throw APIError.fromMessage(ApiErrorMessage.OAUTH_INVALID_STATE);
        case 'INVALID_CODE':
          throw APIError.fromMessage(ApiErrorMessage.OAUTH_INVALID_CODE);
        case 'INVALID_USER':
          throw APIError.fromMessage(ApiErrorMessage.OAUTH_INVALID_USER_DATA);
        case 'NO_TOKENS':
          throw APIError.fromMessage(ApiErrorMessage.OAUTH_NO_TOKENS);
        case 'USER_ALREADY_REGISTERED':
          throw APIError.fromMessage(
            ApiErrorMessage.OAUTH_USER_ALREADY_REGISTERED,
          );
        case 'SOCIAL_ACCOUNT_ALREADY_LINKED':
          throw APIError.fromMessage(
            ApiErrorMessage.OAUTH_SOCIAL_ACCOUNT_ALREADY_LINKED,
          );
      }

      throw APIError.fromMessage(ApiErrorMessage.OPERATION_FAILED, error.cause);
    }

    const { result: data, type } = result.value;

    if (type === 'login') {
      res.cookie(
        CookieName.REFRESH_TOKEN,
        data.refresh.token,
        CookieUtils.getCookieSettings(data.refresh.expires),
      );

      return {
        user: data.user,
        access: data.access,
      };
    } else if (type === 'bind') {
      return {
        user: data,
        access: null,
      };
    }
  }

  @Get('bind')
  @UseAuth()
  @UseGuards(AuthGuard('google'))
  async bind(@LoggedUser() user: User, @Res() res: Response) {
    const result = await this.gOauthService.bind(user);

    if (result.isErr()) {
      throw APIError.fromMessage(ApiErrorMessage.OAUTH_INVALID_STATE);
    }

    const url = result.value;

    res.redirect(url);
  }
}
