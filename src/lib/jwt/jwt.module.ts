import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';

import { IJWTConfig } from '../config/configs/jwt.config';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const jwtConfig = configService.get<IJWTConfig>('jwt-config');

        return <JwtModuleOptions>{
          secret: jwtConfig?.secret,
        };
      },
    }),
  ],
  exports: [JwtModule],
})
export class JWTConfigModule {}
