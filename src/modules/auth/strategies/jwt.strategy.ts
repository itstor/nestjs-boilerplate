import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';

import { ConfigName } from '@/common/constants/config-name.constant';
import { User } from '@/entities/user.entity';
import { IJWTConfig } from '@/lib/config/configs/jwt.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly config: ConfigService,
  ) {
    const secret = config.get<IJWTConfig>(ConfigName.JWT)?.secret;

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
      ignoreExpiration: false,
    });
  }

  async validate(payload: { sub: string }) {
    const { sub: id } = payload;

    return await this.userRepository.findOne({
      where: {
        id: id,
      },
    });
  }
}
