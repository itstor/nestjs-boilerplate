import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import * as otpGenerator from 'otp-generator';
import { Repository } from 'typeorm';

import { OneTimePassword, OTPType } from '@/entities/one-time-password.entity';

@Injectable()
export class OTPService {
  constructor(
    @InjectRepository(OneTimePassword)
    private readonly otpRepo: Repository<OneTimePassword>,
  ) {}

  /**
   * Generate OTP
   * @param userid
   * @param type
   * @param ttl - Time to live in seconds (default: 300)
   * @param lenght - OTP lenght (default: 4)
   * @returns
   */
  public async createOTP({
    userId,
    type,
    ttl = 300,
    length = 5,
  }: {
    userId?: string;
    type: OTPType;
    ttl?: number;
    length?: number;
  }) {
    const code = otpGenerator.generate(length, {
      digits: true,
    });

    const otp = await this.otpRepo.save(
      this.otpRepo.create({
        code,
        type,
        user: { id: userId },
        expiredOn: dayjs().add(ttl, 'second').toDate(),
      }),
    );

    return {
      otp,
      ttl,
      length,
    };
  }

  public async verifyOTP({
    code,
    type,
    userid,
  }: {
    code: string;
    type: OTPType;
    userid?: string;
  }) {
    const otp = await this.otpRepo.findOne({
      where: {
        code,
        type,
        user: { id: userid },
      },
    });

    if (!otp) {
      return false;
    }

    if (dayjs().isAfter(dayjs(otp.expiredOn))) {
      return false;
    }

    return true;
  }
}
