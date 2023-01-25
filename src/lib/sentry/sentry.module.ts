import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SentryModule, SentryModuleOptions } from '@ntegral/nestjs-sentry';

import { ConfigName } from '@/common/constants/config-name.constant';

import { IAppEnvConfig } from '../config/configs/app.config';
import { ISentryConfig } from '../config/configs/sentry.config';

@Module({
  imports: [
    SentryModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const sentryConfig = configService.get<ISentryConfig>(
          ConfigName.SENTRY,
        );
        const appConfig = configService.get<IAppEnvConfig>(ConfigName.APP);

        return <SentryModuleOptions>{
          enabled: sentryConfig?.enabled,
          dsn: sentryConfig?.dsn,
          debug: appConfig?.environment !== 'production',
          environment: appConfig?.environment,
          release: appConfig?.version,
          logLevels: ['debug', 'error'],
        };
      },
    }),
  ],
  exports: [SentryModule],
})
export class SentryConfigModule {}
