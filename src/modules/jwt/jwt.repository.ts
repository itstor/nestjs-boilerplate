import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import * as dayjs from 'dayjs';

import { ConfigName } from '@/common/constants/config-name.constant';
import { IJWTConfig } from '@/lib/config/configs/jwt.config';

@Injectable()
export class JWTRepository {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private readonly jwtConfig = this.configService.get<IJWTConfig>(
    ConfigName.JWT,
  );

  private readonly BASE_OPTIONS: JwtSignOptions = {
    issuer: 'cats',
  };

  public async verify(
    token: string,
    options?: JwtVerifyOptions,
    ignoreExpiration = false,
  ) {
    return await this.jwtService.verifyAsync(token, {
      secret: this.jwtConfig?.secret,
      clockTimestamp: ignoreExpiration ? dayjs().unix() : undefined,
      issuer: this.BASE_OPTIONS.issuer,
      ignoreExpiration,
      ...options,
    });
  }

  public async sign(
    payload: Record<string, unknown>,
    options?: JwtSignOptions,
  ) {
    return await this.jwtService.signAsync(payload, {
      secret: this.jwtConfig?.secret,
      ...this.BASE_OPTIONS,
      ...options,
    });
  }

  public decode(token: string) {
    return this.jwtService.decode(token) as Record<string, any>;
  }
}
