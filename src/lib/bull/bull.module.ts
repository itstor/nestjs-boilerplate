import { BullModule, BullRootModuleOptions } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { IRedisEnvConfig } from '../config/configs/redis.config';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const redisConfig = configService.get<IRedisEnvConfig>('redis-config');
        return <BullRootModuleOptions>{
          redis: {
            host: redisConfig?.host,
            port: redisConfig?.port,
          },
        };
      },
    }),
  ],
  exports: [BullModule],
})
export class BullConfigModule {}
