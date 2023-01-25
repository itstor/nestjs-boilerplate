import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Users } from '@/entities/users.entity';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { EmailModule } from '../email/email.module';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), EmailModule],
  controllers: [UserController],
  providers: [UserService, JwtStrategy, ConfigService],
  exports: [UserService],
})
export class UserModule {}
