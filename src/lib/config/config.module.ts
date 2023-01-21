import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import appConfig from './configs/app.config';
import dbConfig from './configs/db.config';
import jwtConfig from './configs/jwt.config';
import keyConfig from './configs/key.config';
import redisConfig from './configs/redis.config';
import smtpConfig from './configs/smtp.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV}`],
      load: [
        appConfig,
        jwtConfig,
        smtpConfig,
        keyConfig,
        dbConfig,
        redisConfig,
      ],
    }),
  ],
  exports: [ConfigModule],
})
export class AppConfigModule {}
