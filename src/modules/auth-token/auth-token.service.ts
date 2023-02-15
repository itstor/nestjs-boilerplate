import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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

import { JWTRepository } from '../jwt/jwt.repository';

@Injectable()
export class AuthTokenService {
  private readonly jwtConfig?: IJWTConfig;

  constructor(
    @InjectRepository(RefreshToken)
    private readonly tokenRepo: Repository<RefreshToken>,
    private readonly jwtRepo: JWTRepository,
    private readonly configService: ConfigService,
  ) {
    this.jwtConfig = this.configService.get<IJWTConfig>(ConfigName.JWT);
  }

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

    const signed = await this.jwtRepo.sign(
      {
        ...pick(user, ['email', 'name', 'role']),
      },
      {
        subject: user.id,
        jwtid: id,
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

    const token = await this.jwtRepo.sign(
      {
        ...pick(user, ['email', 'name', 'role']),
      },
      {
        subject: user.id,
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
      await this.jwtRepo.verify(token);
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        return err(new ServiceException('EXPIRED'));
      }

      return err(new ServiceException('INVALID'));
    }

    const decodedJwt = this.jwtRepo.decode(token);

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

  public async revokeToken(token: string, all = false) {
    const decodedJwt = this.jwtRepo.decode(token);

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
