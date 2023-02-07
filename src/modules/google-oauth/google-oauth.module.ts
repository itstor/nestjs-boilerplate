import { Module } from '@nestjs/common';

import { GoogleOauthController } from './google-oauth.controller';
import { GoogleOauthService } from './google-oauth.service';

@Module({
  providers: [GoogleOauthService],
  controllers: [GoogleOauthController],
})
export class GoogleOauthModule {}
