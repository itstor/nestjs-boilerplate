import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OneTimePassword } from '@/entities/one-time-password.entity';

import { OTPService } from './otp.service';

@Module({
  imports: [TypeOrmModule.forFeature([OneTimePassword])],
  providers: [ConfigService, OTPService],
  exports: [OTPService],
})
export class OTPModule {}
