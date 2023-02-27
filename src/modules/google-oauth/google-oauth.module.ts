import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { GoogleOauthController } from './google-oauth.controller';
import { GoogleOauthService } from './google-oauth.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [GoogleOauthService, ConfigService],
  controllers: [GoogleOauthController],
})
export class GoogleOauthModule {}
