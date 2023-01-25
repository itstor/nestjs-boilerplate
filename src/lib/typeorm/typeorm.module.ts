import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';

import { ConfigName } from '@/common/constants/config-name.constant';
import { IAppEnvConfig } from '@/lib/config/configs/app.config';
import { IDatabaseConfig } from '@/lib/config/configs/db.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbConfig = configService.get<IDatabaseConfig>(ConfigName.DB);
        const appConfig = configService.get<IAppEnvConfig>(ConfigName.APP);

        return <TypeOrmModuleOptions>{
          type: 'sqlite',
          // host: path.join(__dirname, '..', '..', '..', 'test.db'),
          // port: dbConfig?.port,
          // username: dbConfig?.username,
          // password: dbConfig?.password,
          database: path.join(__dirname, '..', '..', '..', 'test.db'),
          entities: [
            path.join(__dirname, '..', '..', 'entities', '*.entity.{ts,js}'),
          ],
          migrations: [path.join(__dirname, '..', '..', 'migrations', '*')],
          synchronize: appConfig?.environment !== 'production',
        };
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class TypeOrmModuleConfig {}
