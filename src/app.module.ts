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
import { SessionConfigModule } from './lib/session/session.module';
import { EmailModule, PingModule, UserModule } from './modules';
import { AccountModule } from './modules/account/account.module';
import { AuthModule } from './modules/auth/auth.module';
import { GoogleOauthModule } from './modules/google-oauth/google-oauth.module';
import { TokenModule } from './modules/token/token.module';

@Module({
  imports: [
    AppConfigModule,
    LoggerConfigModule,
    TypeOrmModuleConfig,
    SessionConfigModule,
    BullNestModule,
    NodeMailerConfigModule,
    JWTConfigModule,
    EmailModule,
    ThrottlerConfigModule,
    SentryConfigModule,
    UserModule,
    PingModule,
    AuthModule,
    TokenModule,
    AccountModule,
    GoogleOauthModule,
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
