import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerModuleOptions } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';

import { ConfigName } from '@/common/constants/config-name.constant';

import { IAppEnvConfig } from '../config/configs/app.config';
import { IThrottleConfig } from '../config/configs/throttle.config';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const throttleConfig = configService.get<IThrottleConfig>(
          ConfigName.THROTTLE,
        );

        const appConfig = configService.get<IAppEnvConfig>(ConfigName.APP);

        return <ThrottlerModuleOptions>{
          ttl: throttleConfig?.ttl,
          limit: throttleConfig?.limit,
          storage: new ThrottlerStorageRedisService(throttleConfig?.redis_url),
          skipIf: () => !appConfig?.isProduction,
        };
      },
    }),
  ],
  exports: [],
})
export class ThrottlerConfigModule {}
