import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import { TokenExpiredError } from 'jsonwebtoken';
import { pick } from 'lodash';
import { err, ok } from 'neverthrow';
import { FindOptionsWhere, Repository } from 'typeorm';

import { ConfigName } from '@/common/constants/config-name.constant';
import { ServiceException } from '@/common/exceptions/service.exception';
import { RefreshToken } from '@/entities/resfresh-token.entity';
import { User } from '@/entities/user.entity';
import { IJWTConfig } from '@/lib/config/configs/jwt.config';

@Injectable()
export class TokenService {
  private readonly jwtConfig?: IJWTConfig;

  constructor(
    @InjectRepository(RefreshToken)
    private readonly tokenRepo: Repository<RefreshToken>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.jwtConfig = this.configService.get<IJWTConfig>(ConfigName.JWT);
  }

  private readonly BASE_OPTIONS: JwtSignOptions = {
    issuer: 'example',
    audience: 'example',
  };

  /**
   * Generate refresh token
   * @param user
   * @param ttl - in days
   * @returns {Promise<string>}
   */
  public async generateRefreshToken(
    user: Omit<User, 'password'>,
    ttl = this.jwtConfig?.refreshExpirationDays || 30,
  ) {
    const now = dayjs();
    const expiresIn = now.add(ttl, 'days');

    const { id } = await this.tokenRepo.save(
      this.tokenRepo.create({
        user,
        expiredOn: expiresIn.toDate(),
      }),
    );

    const signed = await this.jwtService.signAsync(
      {
        ...pick(user, ['email', 'name', 'role']),
      },
      {
        ...this.BASE_OPTIONS,
        subject: user.id,
        jwtid: id,
        secret: this.jwtConfig?.secret,
        expiresIn: expiresIn.diff(now, 'seconds'),
      },
    );

    return {
      token: signed,
      expires: expiresIn.toDate(),
    };
  }

  public async generateAccessToken(user: Omit<User, 'password'>) {
    const ttl = this.jwtConfig?.accessExpirationMinutes;

    const now = dayjs();
    const expiresIn = now.add(ttl || 5, 'minutes');

    const token = await this.jwtService.signAsync(
      {
        ...pick(user, ['email', 'name', 'role']),
      },
      {
        ...this.BASE_OPTIONS,
        subject: user.id,
        secret: this.jwtConfig?.secret,
        expiresIn: expiresIn.diff(now, 'seconds'),
      },
    );

    return {
      token,
      expires: expiresIn.toDate(),
    };
  }

  public async verifyRefreshToken(token: string) {
    try {
      await this.jwtService.verifyAsync(token, {
        secret: this.jwtConfig?.secret,
        clockTimestamp: dayjs().unix(),
      });
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        return err(new ServiceException('EXPIRED'));
      }

      return err(new ServiceException('INVALID'));
    }

    const decodedJwt = this.jwtService.decode(token) as Record<string, any>;

    const tokenFromDB = await this.tokenRepo.findOne({
      where: {
        id: decodedJwt?.jti,
        user: {
          id: decodedJwt?.sub,
        },
      },
    });

    if (!tokenFromDB) return err(new ServiceException('INVALID'));

    if (tokenFromDB.isRevoked) return err(new ServiceException('REVOKED'));

    return ok(true);
  }

  public async decode(token: string) {
    const decodedJwt = this.jwtService.decode(token) as Record<string, any>;

    return decodedJwt;
  }

  public async revokeToken(token: string, all = false) {
    const decodedJwt = this.jwtService.decode(token) as Record<string, any>;

    const query: FindOptionsWhere<RefreshToken> = {
      ...(all ? {} : { id: decodedJwt?.jti }),
      user: {
        id: decodedJwt?.sub,
      },
    };

    return await this.tokenRepo.update(query, {
      isRevoked: true,
    });
  }
}
