import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { err, ok } from 'neverthrow';

import { ConfigName } from '@/common/constants/config-name.constant';
import { ServiceException } from '@/common/exceptions/service.exception';
import { IJWTConfig } from '@/lib/config/configs/jwt.config';

import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { EmailService } from '../email/email.service';
import { TokenService } from '../token/token.service';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  private readonly jwtConfig?: IJWTConfig;

  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {
    this.jwtConfig = this.configService.get<IJWTConfig>(ConfigName.JWT);
  }

  public async login(data: UserLoginDto) {
    const user = await this.userService.findOne({ email: data.email });

    if (!user) {
      return err(new ServiceException('USER_NOT_FOUND'));
    }

    if (!(await argon2.verify(user.password, data.password))) {
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

  public async register(data: UserRegisterDto) {
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

      return err(new ServiceException('UNKNOWN'));
    }

    const user = createdUser.value;

    await this.emailService.sendVerificationEmail(user);

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
      return err(new ServiceException('INVALID_REFRESH_TOKEN'));
    }

    const decode = await this.tokenService.decode(token);

    const user = await this.userService.findOne({ id: decode.id });

    if (!user) {
      return err(new ServiceException('USER_NOT_FOUND'));
    }

    const accessToken = await this.tokenService.generateAccessToken(user);

    return ok(accessToken);
  }
}
