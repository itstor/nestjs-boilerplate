import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import appConfig from './configs/app.config';
import dbConfig from './configs/db.config';
import jwtConfig from './configs/jwt.config';
import keyConfig from './configs/key.config';
import oauthConfig from './configs/oauth.config';
import redisConfig from './configs/redis.config';
import sentryConfig from './configs/sentry.config';
import smtpConfig from './configs/smtp.config';
import throttleConfig from './configs/throttle.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV}`],
      load: [
        appConfig,
        jwtConfig,
        oauthConfig,
        smtpConfig,
        keyConfig,
        dbConfig,
        redisConfig,
        sentryConfig,
        throttleConfig,
      ],
    }),
  ],
  exports: [ConfigModule],
})
export class AppConfigModule {}
