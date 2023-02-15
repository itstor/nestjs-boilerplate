import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { JWTRepository } from './jwt.repository';

@Module({
  providers: [JWTRepository, JwtService, ConfigService],
  exports: [JWTRepository],
})
export class JWTModule {}
