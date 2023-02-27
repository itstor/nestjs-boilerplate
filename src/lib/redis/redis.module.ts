import { RedisModule, RedisModuleOptions } from '@liaoliaots/nestjs-redis';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { ConfigName } from '@/common/constants/config-name.constant';

import { IRedisConfig } from '../config/configs/redis.config';

@Module({
  imports: [
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const redisConfig = configService.get<IRedisConfig>(ConfigName.REDIS);

        return <RedisModuleOptions>{
          config: {
            url: redisConfig?.redis_url,
          },
        };
      },
    }),
  ],
  exports: [RedisModule],
})
export class RedisNestModule {}
