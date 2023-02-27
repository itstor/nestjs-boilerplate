import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { err, ok } from 'neverthrow';

import { ServiceException } from '@/common/exceptions/service.exception';
import { DateUtils } from '@/common/helpers/date.utils';
import { HashUtils } from '@/common/helpers/hash.utils';
import { OTPType } from '@/entities/otp.entity';
import { User } from '@/entities/user.entity';

import { VerifyResetPasswordOTPDTO } from './dto/verify-reset-password-otp.dto';
import { EmailProducerService } from '../email/producers/email.producer.service';
import { JWTRepository } from '../jwt/jwt.repository';
import { OTPService } from '../otp/otp.service';
import { UserService } from '../user/user.service';

@Injectable()
export class AccountService {
  constructor(
    private readonly userService: UserService,
    private readonly emailService: EmailProducerService,
    private readonly otpService: OTPService,
    private readonly jwtRepo: JWTRepository,
  ) {}

  private readonly ALLOW_RESEND_OTP_IN = 30;

  public async requestForgotPassword(email: string, userTimezone?: string) {
    const previousOTP = await this.otpService.findOne(
      {
        user: { email },
        type: OTPType.RESET_PASSWORD,
      },
      {
        order: {
          createdAt: 'DESC',
        },
      },
    );

    if (previousOTP) {
      const isResendAllowed =
        dayjs(previousOTP.createdAt).unix() + this.ALLOW_RESEND_OTP_IN <
        dayjs().unix();

      if (!isResendAllowed) {
        return err(new ServiceException('RESEND_OTP_NOT_ALLOWED'));
      }
    }

    const user = await this.userService.findOne({ email });

    if (!user) {
      return err(new ServiceException('EMAIL_NOT_FOUND'));
    }

    const createdOTP = await this.otpService.generateOTP({
      userId: user.id,
      type: OTPType.RESET_PASSWORD,
    });

    // Send Email
    await this.emailService.sendResetPasswordEmail({
      email: user.email,
      code: createdOTP.otp.code,
      expireDate: DateUtils.formatTimezone(
        createdOTP.otp.expiredOn,
        userTimezone,
      ),
    });

    const token = await this.jwtRepo.sign(
      {
        exp: dayjs(createdOTP.otp.expiredOn).unix(),
        type: OTPType.RESET_PASSWORD,
      },
      {
        subject: user.id,
        jwtid: createdOTP.otp.id,
      },
    );

    return ok({
      otp: createdOTP.otp,
      ttl: createdOTP.ttl,
      token,
      allowResendIn: {
        value: this.ALLOW_RESEND_OTP_IN,
        unit: 'seconds',
      },
    });
  }

  public async verifyResetPasswordOTP(data: VerifyResetPasswordOTPDTO) {
    try {
      await this.jwtRepo.verify(data.token, undefined);
    } catch (error) {
      return err(new ServiceException('TOKEN_INVALID'));
    }

    const decodeToken = this.jwtRepo.decode(data.token) as {
      jti: string;
      sub: string;
    };

    const isValid = await this.otpService.verifyOTP({
      code: data.otp,
      type: OTPType.RESET_PASSWORD,
      otpId: decodeToken.jti,
      userId: decodeToken.sub,
    });

    if (!isValid) {
      return err(new ServiceException('OTP_INVALID'));
    }

    return ok(isValid);
  }

  public async resetPassword(data: { token: string; password: string }) {
    // Verify the JWT token
    try {
      await this.jwtRepo.verify(data.token, undefined, true);
    } catch (error) {
      return err(new ServiceException('TOKEN_INVALID'));
    }

    // Decode the JWT token
    const { sub: userId, jti: otpId } = this.jwtRepo.decode(data.token) as {
      jti: string;
      sub: string;
    };

    // Find the OTP by id
    const otp = await this.otpService.findOne({
      id: otpId,
    });

    // If OTP not found, return error
    if (!otp) {
      return err(new ServiceException('OTP_NOT_FOUND'));
    }

    // If OTP is not verified, return error
    if (!otp.isVerified) {
      return err(new ServiceException('OTP_NOT_VERIFIED'));
    }

    // Change the password
    await this.userService.update(userId, { password: data.password });

    // Delete the OTP after reset password
    await this.otpService.delete({ id: otp.id });

    return ok(true);
  }

  public async sendEmailVerification(
    user: Pick<User, 'id' | 'email' | 'username' | 'isEmailVerified'>,
    userTimezone?: string,
  ) {
    if (user.isEmailVerified) {
      return err(new ServiceException('EMAIL_ALREADY_VERIFIED'));
    }

    const previousOTP = await this.otpService.findOne(
      {
        user: { id: user.id },
        type: OTPType.VERIFY_EMAIL,
      },
      {
        order: {
          createdAt: 'DESC',
        },
      },
    );

    if (previousOTP) {
      const now = dayjs().unix();
      const allowResend =
        dayjs(previousOTP.createdAt).unix() + this.ALLOW_RESEND_OTP_IN < now;

      if (!allowResend) {
        return err(new ServiceException('RESEND_OTP_NOT_ALLOWED'));
      }
    }

    const createdOTP = await this.otpService.generateOTP({
      userId: user.id,
      type: OTPType.VERIFY_EMAIL,
    });

    await this.emailService.sendVerificationEmail({
      email: user.email,
      username: user.username,
      code: createdOTP.otp.code,
      expireDate: DateUtils.formatTimezone(
        createdOTP.otp.expiredOn,
        userTimezone,
      ),
    });

    return ok({
      otp: createdOTP.otp,
      ttl: createdOTP.ttl,
      allowResendIn: {
        value: this.ALLOW_RESEND_OTP_IN,
        unit: 'seconds',
      },
    });
  }

  public async verifyEmail(
    user: Pick<User, 'id' | 'isEmailVerified'>,
    otp: string,
  ) {
    if (user.isEmailVerified) {
      return err(new ServiceException('EMAIL_ALREADY_VERIFIED'));
    }

    const isValid = await this.otpService.verifyOTP({
      code: otp,
      type: OTPType.VERIFY_EMAIL,
      userId: user.id,
    });

    if (!isValid) {
      return err(new ServiceException('OTP_INVALID'));
    }

    const verifiedUser = await this.userService.update(user.id, {
      isEmailVerified: true,
    });

    if (verifiedUser.isErr()) {
      return err(
        new ServiceException('VERIFY_EMAIL_FAILED', verifiedUser.error.cause),
      );
    }

    return ok(verifiedUser.value);
  }

  public async updateEmail(user: Pick<User, 'email' | 'id'>, newEmail: string) {
    const userResult = await this.userService.findOne({ id: user.id });

    if (!userResult) {
      return err(new ServiceException('USER_NOT_FOUND'));
    }

    if (userResult.email === newEmail) {
      return err(new ServiceException('EMAIL_SAME'));
    }

    const updatedUser = await this.userService.update(user.id, {
      email: newEmail,
      isEmailVerified: false,
    });

    if (updatedUser.isErr()) {
      const error = updatedUser.error;

      if (error.name === 'EXISTS') {
        return err(new ServiceException('EMAIL_EXISTS'));
      }

      return err(new ServiceException('UPDATE_EMAIL_FAILED', error.cause));
    }

    // If user update email successfully, delete all OTPs of that user
    await this.otpService.delete({ user: { id: user.id } });

    return ok(updatedUser.value);
  }

  public async updateUsername(
    user: Pick<User, 'id' | 'username'>,
    username: string,
  ) {
    const userResult = await this.userService.findOne({ id: user.id });

    if (!userResult) {
      return err(new ServiceException('USER_NOT_FOUND'));
    }

    if (userResult.username === username) {
      return err(new ServiceException('USERNAME_SAME_AS_OLD'));
    }

    const updatedUser = await this.userService.update(user.id, {
      username,
    });

    if (updatedUser.isErr()) {
      const error = updatedUser.error;

      if (error.name === 'EXISTS') {
        return err(new ServiceException('USERNAME_EXISTS'));
      }

      return err(new ServiceException('UPDATE_USERNAME_FAILED', error.cause));
    }

    return ok(updatedUser.value);
  }

  public async updatePassword(
    userId: string,
    newPassword: string,
    oldPassword?: string,
  ) {
    const user = await this.userService.findOne({ id: userId });

    if (!user) {
      return err(new ServiceException('USER_NOT_FOUND'));
    }

    // This check is for user who has linked password before. If user has linked password before, we need to check old password
    if (user.password !== null) {
      if (!oldPassword) {
        return err(new ServiceException('OLD_PASSWORD_REQUIRED'));
      }

      const isPasswordMatch = await HashUtils.comparePassword(
        user.password,
        oldPassword,
      );

      if (!isPasswordMatch) {
        return err(new ServiceException('PASSWORD_NOT_MATCH'));
      }
    }

    const updatedUser = await this.userService.update(user.id, {
      password: newPassword,
    });

    if (updatedUser.isErr()) {
      return err(
        new ServiceException('CHANGE_PASSWORD_FAILED', updatedUser.error.cause),
      );
    }

    return ok(updatedUser.value);
  }

  public async checkLinkedPassword(userId: string) {
    const user = await this.userService.findOne({ id: userId });

    if (!user) {
      return err(new ServiceException('USER_NOT_FOUND'));
    }

    return ok(user.password !== null);
  }
}
