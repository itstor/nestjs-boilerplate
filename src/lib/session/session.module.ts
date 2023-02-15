import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as CryptoJS from 'crypto-js';
import {
  CookieSessionModule,
  NestCookieSessionOptions,
} from 'nestjs-cookie-session';

import { ConfigName } from '@/common/constants/config-name.constant';

import { IAppEnvConfig } from '../config/configs/app.config';
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

        const appConfig = configService.get<IAppEnvConfig>(ConfigName.APP);

        return <NestCookieSessionOptions>{
          session: {
            signed: true,
            secure: appConfig?.isProduction,
            keys: [secretKey],
            httpOnly: appConfig?.isProduction,
            sameSite: 'strict',
          },
        };
      },
    }),
  ],
})
export class SessionConfigModule {}
