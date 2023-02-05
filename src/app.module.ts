import { Module } from '@nestjs/common';
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
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useValue: new SentryInterceptor(),
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard,
    },
  ],
})
export class AppModule {}
