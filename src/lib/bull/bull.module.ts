import { BullModule, BullRootModuleOptions } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { ConfigName } from '@/common/constants/config-name.constant';

import { IBullConfig } from '../config/configs/bull.config';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const redisConfig = configService.get<IBullConfig>(ConfigName.BULL);
        return <BullRootModuleOptions>{
          url: redisConfig?.redis_url,
        };
      },
    }),
  ],
  exports: [BullModule],
})
export class BullNestModule {}
