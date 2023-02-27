import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import SocialAccount from '@/entities/linked-account.entity';

import { SocialAccountService } from './social-account.service';

@Module({
  imports: [TypeOrmModule.forFeature([SocialAccount])],
  providers: [SocialAccountService],
  exports: [SocialAccountService],
})
export class SocialAccountModule {}
