import { people } from '@googleapis/people';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { Redis } from 'ioredis';
import * as Joi from 'joi';
import { omit } from 'lodash';
import { nanoid } from 'nanoid';
import { err, ok } from 'neverthrow';

import { ConfigName } from '@/common/constants/config-name.constant';
import { ServiceException } from '@/common/exceptions/service.exception';
import { AuthProvider } from '@/common/types/enums/auth-provider.enum';
import { IOAuthState } from '@/common/types/interfaces/oauth-state.interface';
import { User } from '@/entities/user.entity';
import { IOAuthConfig } from '@/lib/config/configs/oauth.config';

import { IGoogleUserInfo } from './interfaces/google-user-info.interface';
import { AuthService } from '../auth/auth.service';
@Injectable()
export class GoogleOauthService {
  private readonly OAuthConfig?: IOAuthConfig;
  private readonly OAuthClient: OAuth2Client;
  private readonly PeopleApis = people({
    version: 'v1',
  });

  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    @InjectRedis() private readonly redis: Redis,
  ) {
    this.OAuthConfig = this.configService.get<IOAuthConfig>(ConfigName.OAUTH);

    this.OAuthClient = new OAuth2Client({
      clientId: this.OAuthConfig?.googleClientId,
      clientSecret: this.OAuthConfig?.googleClientSecret,
      redirectUri: 'http://127.0.0.1/v1/auth/oauth/google/callback',
    });
  }

  public async getAuthUrl(state?: Record<string, any>) {
    const scopes = ['email', 'profile'];

    const encodedState = state
      ? Buffer.from(JSON.stringify(state)).toString('base64')
      : undefined;

    return this.OAuthClient.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      state: encodedState,
    });
  }

  public async login(state?: string, refferer?: string, redirect = false) {
    let decodedState: Record<string, any>;
    try {
      decodedState = state
        ? JSON.parse(Buffer.from(state, 'base64').toString())
        : undefined;
    } catch (e) {
      return err(new ServiceException('INVALID_STATE'));
    }

    const url = await this.getAuthUrl({
      type: 'login',
      ...omit(decodedState, ['type']),
      redirect,
      refferer,
    });

    return ok(url);
  }

  public async getUserInfo(accessToken: string) {
    // Get user info using access token and google people api
    const people = await this.PeopleApis.people.get({
      resourceName: 'people/me',
      personFields: 'names,emailAddresses,metadata',
      access_token: accessToken,
    });

    const { names, emailAddresses, metadata } = people.data;

    const user = {
      id: metadata?.sources?.[0]?.id,
      email: emailAddresses?.[0]?.value,
      name: names?.[0]?.displayName,
      isEmailVerified: emailAddresses?.[0]?.metadata?.verified,
    };

    return user;
  }

  public async callback(code: string, state: IOAuthState) {
    // Get access token from code
    let accessToken: string;
    try {
      const {
        tokens: { access_token },
      } = await this.OAuthClient.getToken(code);

      if (!access_token) {
        return err(new ServiceException('NO_TOKENS'));
      }

      accessToken = access_token;
    } catch (e) {
      return err(new ServiceException('INVALID_CODE'));
    }

    // Get user info using access token and google people api
    const userInfoResult = await this.getUserInfo(accessToken);

    // Validate user info. Ensure that user info contain valid id and email. Name is optional
    const validatedUserInfo = Joi.object<IGoogleUserInfo>({
      id: Joi.string().required(),
      email: Joi.string().email().required(),
      isEmailVerified: Joi.boolean().default(false),
      name: Joi.string().optional(),
    }).validate(userInfoResult);

    if (validatedUserInfo.error) {
      return err(new ServiceException('INVALID_USER'));
    }

    if (state.type === 'login') {
      const loginResult = await this.authService.OAuthLogin(
        AuthProvider.GOOGLE,
        {
          id: validatedUserInfo.value.id,
          email: validatedUserInfo.value.email,
        },
      );

      if (loginResult.isErr()) {
        const error = loginResult.error;

        switch (error.name) {
          case 'USER_ALREADY_REGISTERED':
            return err(new ServiceException('USER_ALREADY_REGISTERED'));
        }

        return err(new ServiceException('UNKNOWN'));
      }

      return ok({
        result: loginResult.value,
        type: state.type,
      });
    } else if (state.type === 'bind') {
      if (!state.key) {
        return err(new ServiceException('INVALID_STATE'));
      }

      const userId = await this.redis.get(state.key);

      if (!userId) {
        return err(new ServiceException('INVALID_STATE'));
      }

      const bindResult = await this.authService.OAuthBind(AuthProvider.GOOGLE, {
        id: validatedUserInfo.value.id,
        userId: userId,
      });

      if (bindResult.isErr()) {
        const error = bindResult.error;

        switch (error.name) {
          case 'SOCIAL_ACCOUNT_ALREADY_LINKED':
            return err(new ServiceException('SOCIAL_ACCOUNT_ALREADY_LINKED'));
        }

        return err(new ServiceException('UNKNOWN'));
      }

      return ok({
        result: bindResult.value,
        type: state.type,
      });
    } else {
      return err(new ServiceException('INVALID_STATE'));
    }
  }

  public async bind(user: User) {
    const key = nanoid();

    this.redis.set(key, user.id, 'EX', 60 * 5);

    const url = await this.getAuthUrl({
      type: 'bind',
      key: key,
    });

    return ok(url);
  }
}
