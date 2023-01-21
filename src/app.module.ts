import { Module } from '@nestjs/common';

import {
  AppConfigModule,
  BullConfigModule,
  JWTConfigModule,
  LoggerConfigModule,
  NodeMailerConfigModule,
  TypeOrmModuleConfig,
} from './lib';
import { EmailModule, PingModule, UserModule } from './modules';
import { AuthModule } from './modules/auth/auth.module';
import { TokenModule } from './modules/token/token.module';

@Module({
  imports: [
    AppConfigModule,
    LoggerConfigModule,
    TypeOrmModuleConfig,
    BullConfigModule,
    NodeMailerConfigModule,
    JWTConfigModule,
    EmailModule,
    UserModule,
    PingModule,
    AuthModule,
    TokenModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
