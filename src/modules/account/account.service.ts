import { Injectable } from '@nestjs/common';
import { err, ok } from 'neverthrow';

import { ServiceException } from '@/common/exceptions/service.exception';
import { OTPType } from '@/entities/one-time-password.entity';

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

  public async recoverPassword(email: string) {
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
