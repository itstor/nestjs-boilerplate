import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule, Params } from 'nestjs-pino';

import { IAppEnvConfig } from '@/lib/config/configs/app.config';

@Module({
  imports: [
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const appConfig = configService.get<IAppEnvConfig>('app-config');

        return <Params>{
          pinoHttp: {
            transport:
              appConfig?.environment !== 'production'
                ? { target: 'pino-pretty' }
                : undefined,
          },
        };
      },
    }),
  ],
  exports: [LoggerModule],
})
export class LoggerConfigModule {}
