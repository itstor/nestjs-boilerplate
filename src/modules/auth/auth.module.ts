import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '@/entities/user.entity';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthTokenModule } from '../auth-token/auth-token.module';
import { EmailModule } from '../email/email.module';
import { JWTModule } from '../jwt/jwt.module';
import { OTPModule } from '../otp/otp.module';
import { SocialAccountModule } from '../social-account/social-account.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    AuthTokenModule,
    UserModule,
    EmailModule,
    PassportModule,
    OTPModule,
    JWTModule,
    SocialAccountModule,
    TypeOrmModule.forFeature([User]),
  ],
  providers: [AuthService, ConfigService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
