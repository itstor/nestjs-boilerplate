import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as CryptoJS from 'crypto-js';
import { nanoid } from 'nanoid';
import {
  CookieSessionModule,
  NestCookieSessionOptions,
} from 'nestjs-cookie-session';

import { ConfigName } from '@/common/constants/config-name.constant';

import { IKeyConfig } from '../config/configs/key.config';

@Module({
  imports: [
    CookieSessionModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const secretKey =
          configService.get<IKeyConfig>(ConfigName.KEY)?.sessionSecretKey ??
          CryptoJS.lib.WordArray.random(256 / 8).toString();

        return <NestCookieSessionOptions>{
          session: {
            secret: secretKey,
            resave: false,
            saveUninitialized: false,
            genid: () => nanoid(),
          },
        };
      },
    }),
  ],
})
export class SessionConfigModule {}
