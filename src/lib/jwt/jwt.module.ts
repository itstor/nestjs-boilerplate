import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';

import { ConfigName } from '@/common/constants/config-name.constant';

import { IJWTConfig } from '../config/configs/jwt.config';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const jwtConfig = configService.get<IJWTConfig>(ConfigName.JWT);

        return <JwtModuleOptions>{
          secret: jwtConfig?.secret,
        };
      },
    }),
  ],
  exports: [JwtModule],
})
export class JWTConfigModule {}
