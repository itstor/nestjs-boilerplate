import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OTP } from '@/entities/otp.entity';

import { ClearOTPConsumer } from './consumers/clear-otp.consumer';
import { OTPService } from './otp.service';
import { ClearOTPSchedule } from './schedulers/clear-otp.schedule';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'clearOTP',
    }),
    TypeOrmModule.forFeature([OTP]),
  ],
  providers: [ConfigService, OTPService, ClearOTPConsumer, ClearOTPSchedule],
  exports: [OTPService],
})
export class OTPModule {}
