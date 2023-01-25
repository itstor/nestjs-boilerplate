import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule, Params } from 'nestjs-pino';

import { ConfigName } from '@/common/constants/config-name.constant';
import { IAppEnvConfig } from '@/lib/config/configs/app.config';

@Module({
  imports: [
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const appConfig = configService.get<IAppEnvConfig>(ConfigName.APP);

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
