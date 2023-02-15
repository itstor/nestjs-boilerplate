import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RefreshToken } from '@/entities/resfresh-token.entity';

import { AuthTokenService } from './auth-token.service';
import { ClearTokenConsumer } from './consumers/clear-token.consumer';
import { ClearTokenSchedule } from './schedulers/clear-token.schedule';
import { JWTModule } from '../jwt/jwt.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'clearToken',
    }),
    TypeOrmModule.forFeature([RefreshToken]),
    UserModule,
    JWTModule,
  ],
  providers: [
    AuthTokenService,
    ConfigService,
    ClearTokenSchedule,
    ClearTokenConsumer,
  ],
  exports: [AuthTokenService],
})
export class AuthTokenModule {}
