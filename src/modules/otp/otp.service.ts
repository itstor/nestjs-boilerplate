import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import { PaginateConfig } from 'nestjs-paginate';
import * as otpGenerator from 'otp-generator';
import { MoreThanOrEqual, Repository } from 'typeorm';

import { CRUDService } from '@/common/classes/base-crud.service';
import { OneTimePassword, OTPType } from '@/entities/one-time-password.entity';

@Injectable()
export class OTPService extends CRUDService<OneTimePassword> {
  constructor(
    @InjectRepository(OneTimePassword)
    private readonly otpRepo: Repository<OneTimePassword>,
  ) {
    const paginationConfig: PaginateConfig<OneTimePassword> = {
      sortableColumns: [
        'id',
        'isVerified',
        'expiredOn',
        'createdAt',
        'updatedAt',
      ],
      nullSort: 'last',
      defaultLimit: 10,
      defaultSortBy: [['id', 'ASC']],
    };

    super(otpRepo, paginationConfig, 'OTP');
  }

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

  public async verifyOTP(data: {
    code: string;
    type: OTPType;
    userId?: string;
  }) {
    const otp = await this.otpRepo.findOne({
      where: {
        code: data.code,
        type: data.type,
        isVerified: false,
        expiredOn: MoreThanOrEqual(dayjs().toDate()),
        ...(data.userId ? { user: { id: data.userId } } : {}),
      },
      order: {
        createdAt: 'DESC',
      },
    });

    if (!otp) {
      return false;
    }

    otp.isVerified = true;
    await this.otpRepo.save(otp);

    return true;
  }
}
