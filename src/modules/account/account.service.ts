import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { err, ok } from 'neverthrow';

import { ServiceException } from '@/common/exceptions/service.exception';
import { OTPType } from '@/entities/one-time-password.entity';

import { VerifyResetPasswordOTPDTO } from './dto/verify-reset-password-otp.dto';
import { SendEmailProducerService } from '../email/producers/send-email.producer.service';
import { OTPService } from '../otp/otp.service';
import { UserService } from '../user/user.service';

@Injectable()
export class AccountService {
  constructor(
    private readonly userService: UserService,
    private readonly emailService: SendEmailProducerService,
    private readonly otpService: OTPService,
  ) {}

  public async requestResetPassword(email: string, userTimezone?: string) {
    const user = await this.userService.findOne({ email });

    if (!user) {
      return err(new ServiceException('USER_NOT_FOUND'));
    }

    const createdOTP = await this.otpService.createOTP({
      userId: user.id,
      type: OTPType.RESET_PASSWORD,
    });

    await this.emailService.sendResetPasswordEmail({
      email: user.email,
      code: createdOTP.otp.code,
      expireDate: dayjs(createdOTP.otp.expiredOn)
        .tz(userTimezone)
        .format('DD/MM/YYYY HH:mm:ss z'),
    });

    return ok({
      otp: createdOTP.otp,
      ttl: createdOTP.ttl,
      length: createdOTP.length,
      allowResendIn: {
        value: 30,
        unit: 'seconds',
      },
    });
  }

  public async verifyResetPasswordOTP(data: VerifyResetPasswordOTPDTO) {
    return await this.otpService.verifyOTP({
      code: data.otp,
      type: OTPType.RESET_PASSWORD,
    });
  }

  public async resetPassword(data: { otpId: string; password: string }) {
    const otp = await this.otpService.findOne(
      {
        id: data.otpId,
        isVerified: true,
      },
      {
        relations: ['user'],
      },
    );

    if (!otp) {
      return err(new ServiceException('OTP_NOT_FOUND'));
    }

    const user = await this.userService.findOne({ id: otp.user.id });

    if (!user) {
      return err(new ServiceException('USER_NOT_FOUND'));
    }

    await this.changePassword(user.id, data.password);

    await this.otpService.delete({ id: otp.id });

    return ok(user);
  }

  public async changePassword(userId: string, password: string) {
    return await this.userService.update(userId, { password: password });
  }

  public async resendResetPasswordOTP(otpId: string) {
    const otp = await this.otpService.findOne(
      {
        id: otpId,
        isVerified: false,
      },
      {
        relations: ['user'],
      },
    );

    if (!otp) {
      return err(new ServiceException('OTP_NOT_FOUND'));
    }

    const user = await this.userService.findOne({ id: otp.user.id });

    if (!user) {
      return err(new ServiceException('USER_NOT_FOUND'));
    }

    const createdOTP = await this.otpService.createOTP({
      userId: user.id,
      type: OTPType.RESET_PASSWORD,
    });

    await this.emailService.sendResetPasswordEmail({
      email: user.email,
      code: createdOTP.otp.code,
      expireDate: createdOTP.otp.expiredOn.toUTCString(),
    });

    return ok({
      otp: createdOTP.otp,
      ttl: createdOTP.ttl,
      length: createdOTP.length,
      allowResendIn: {
        value: 30,
        unit: 'seconds',
      },
    });
  }
}
