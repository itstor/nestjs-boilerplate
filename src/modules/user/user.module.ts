import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '@/entities/user.entity';

import { AdminUserController } from './admin-user.controller';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), EmailModule],
  controllers: [UserController, AdminUserController],
  providers: [UserService, JwtStrategy, ConfigService],
  exports: [UserService],
})
export class UserModule {}
