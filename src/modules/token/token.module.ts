import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RefreshTokens } from '@/entities/resfresh-tokens.entity';

import { TokenController } from './token.controller';
import { TokenService } from './token.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([RefreshTokens]), UserModule],
  providers: [TokenService, JwtService, ConfigService],
  controllers: [TokenController],
  exports: [TokenService],
})
export class TokenModule {}
