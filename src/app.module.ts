import { HttpException, Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { SentryInterceptor } from '@ntegral/nestjs-sentry';

import { ThrottlerBehindProxyGuard } from './common/guards/throttler-behind-proxy.guard';
import {
  AppConfigModule,
  BullNestModule,
  JWTConfigModule,
  LoggerConfigModule,
  NodeMailerConfigModule,
  SentryConfigModule,
  ThrottlerConfigModule,
  TypeOrmModuleConfig,
} from './lib';
import { RedisNestModule } from './lib/redis/redis.module';
import { SessionConfigModule } from './lib/session/session.module';
import { EmailModule, UserModule } from './modules';
import { AccountModule } from './modules/account/account.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuthTokenModule } from './modules/auth-token/auth-token.module';
import { GoogleOauthModule } from './modules/google-oauth/google-oauth.module';
import { HealthCheckModule } from './modules/health-check/health-check.module';
import { SocialAccountModule } from './modules/social-account/social-account.module';

@Module({
  imports: [
    AppConfigModule,
    LoggerConfigModule,
    TypeOrmModuleConfig,
    SessionConfigModule,
    BullNestModule,
    NodeMailerConfigModule,
    JWTConfigModule,
    RedisNestModule,
    EmailModule,
    ThrottlerConfigModule,
    SentryConfigModule,
    UserModule,
    AuthModule,
    AuthTokenModule,
    AccountModule,
    SocialAccountModule,
    // GoogleOauthModule,
    HealthCheckModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useValue: new SentryInterceptor({
        filters: [
          {
            type: HttpException,
            filter: (e: HttpException) =>
              !(e.getStatus() >= 500 && e.getStatus() < 600),
          },
        ],
      }),
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard,
    },
  ],
})
export class AppModule {}
