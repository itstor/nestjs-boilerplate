import { Module } from '@nestjs/common';

import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { EmailModule } from '../email/email.module';
import { OTPModule } from '../otp/otp.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule, EmailModule, OTPModule],
  providers: [AccountService],
  controllers: [AccountController],
})
export class AccountModule {}
