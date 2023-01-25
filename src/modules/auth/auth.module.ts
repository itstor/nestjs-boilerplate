import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Users } from '@/entities/users.entity';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { EmailModule } from '../email/email.module';
import { TokenModule } from '../token/token.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TokenModule,
    UserModule,
    EmailModule,
    PassportModule,
    TypeOrmModule.forFeature([Users]),
  ],
  providers: [AuthService, ConfigService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
