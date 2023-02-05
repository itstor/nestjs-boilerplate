import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RefreshToken } from '@/entities/resfresh-token.entity';

import { ClearTokenConsumer } from './consumers/clear-tokens.consumer';
import { ClearTokenSchedule } from './schedulers/clear-tokens.schedule';
import { TokenService } from './token.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'clearTokens',
    }),
    TypeOrmModule.forFeature([RefreshToken]),
    UserModule,
  ],
  providers: [
    TokenService,
    JwtService,
    ConfigService,
    ClearTokenSchedule,
    ClearTokenConsumer,
  ],
  exports: [TokenService],
})
export class TokenModule {}
