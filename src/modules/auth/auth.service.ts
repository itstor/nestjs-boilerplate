import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { err, ok } from 'neverthrow';

import { ConfigName } from '@/common/constants/config-name.constant';
import { ServiceException } from '@/common/exceptions/service.exception';
import { DateUtils } from '@/common/helpers/date.utils';
import { HashUtils } from '@/common/helpers/hash.utils';
import { OTPType } from '@/entities/otp.entity';
import { IJWTConfig } from '@/lib/config/configs/jwt.config';

import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { AuthTokenService } from '../auth-token/auth-token.service';
import { EmailProducerService } from '../email/producers/email.producer.service';
import { JWTRepository } from '../jwt/jwt.repository';
import { OTPService } from '../otp/otp.service';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  private readonly jwtConfig?: IJWTConfig;

  constructor(
    private readonly userService: UserService,
    private readonly tokenService: AuthTokenService,
    private readonly configService: ConfigService,
    private readonly emailProducerService: EmailProducerService,
    private readonly otpService: OTPService,
    private readonly jwtRepo: JWTRepository,
  ) {
    this.jwtConfig = this.configService.get<IJWTConfig>(ConfigName.JWT);
  }

  public async login(data: UserLoginDto) {
    const isEmail = Joi.string()
      .email()
      .required()
      .validate(data.emailOrUsername);

    const query = isEmail.error
      ? { username: data.emailOrUsername }
      : { email: data.emailOrUsername };

    const user = await this.userService.findOne(query);

    if (!user) {
      return err(new ServiceException('USER_NOT_FOUND'));
    }

    const isPasswordCorrect = await HashUtils.comparePassword(
      user.password,
      data.password,
    );

    if (!isPasswordCorrect) {
      return err(new ServiceException('WRONG_PASSWORD'));
    }

    const refreshToken = await this.tokenService.generateRefreshToken(user);

    const acccessToken = await this.tokenService.generateAccessToken(user);

    return ok({
      user,
      access: {
        token: acccessToken.token,
        expires: acccessToken.expires,
      },
      refresh: {
        token: refreshToken.token,
        expires: refreshToken.expires,
      },
    });
  }

  public async logout(token: string, allDevices = false) {
    return await this.tokenService.revokeToken(token, allDevices);
  }

  public async register(data: UserRegisterDto, userTimezone?: string) {
    const createdUser = await this.userService.create(data);

    if (createdUser.isErr()) {
      const error = createdUser.error;

      if (error.name === 'EXISTS') {
        switch (error.message) {
          case 'email':
            return err(new ServiceException('USER_EXISTS'));
          case 'username':
            return err(new ServiceException('USERNAME_EXISTS'));
        }
      }

      return err(new ServiceException('UNKNOWN', error.cause));
    }

    const user = createdUser.value;

    const {
      otp: { code, expiredOn },
    } = await this.otpService.generateOTP({
      userId: user.id,
      type: OTPType.VERIFY_EMAIL,
    });

    await this.emailProducerService.sendVerificationEmail({
      code: code,
      email: user.email,
      username: user.username,
      expireDate: DateUtils.formatTimezone(expiredOn, userTimezone),
    });

    const refreshToken = await this.tokenService.generateRefreshToken(
      user,
      this.jwtConfig?.refreshExpirationDays,
    );

    const acccessToken = await this.tokenService.generateAccessToken(user);

    return ok({
      user,
      access: {
        token: acccessToken.token,
        expires: acccessToken.expires,
      },
      refresh: {
        token: refreshToken.token,
        expires: refreshToken.expires,
      },
    });
  }

  public async refresh(token: string) {
    const isVerified = await this.tokenService.verifyRefreshToken(token);

    if (isVerified.isErr()) {
      const error = isVerified.error;

      if (error.name === 'EXPIRED') {
        return err(new ServiceException('REFRESH_TOKEN_EXPIRED'));
      } else if (error.name === 'INVALID') {
        return err(new ServiceException('INVALID_REFRESH_TOKEN'));
      } else if (error.name === 'REVOKED') {
        return err(new ServiceException('REVOKED_REFRESH_TOKEN'));
      }
    }

    const decode = await this.jwtRepo.decode(token);

    const user = await this.userService.findOne({ id: decode.id });

    if (!user) {
      return err(new ServiceException('USER_NOT_FOUND'));
    }

    const accessToken = await this.tokenService.generateAccessToken(user);

    return ok(accessToken);
  }
}
