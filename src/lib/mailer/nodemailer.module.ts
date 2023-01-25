import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule, MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from 'path';

import { ConfigName } from '@/common/constants/config-name.constant';
import { ISMTPConfig } from '@/lib/config/configs/smtp.config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const emailConfig = configService.get<ISMTPConfig>(ConfigName.SMTP);

        return <MailerOptions>{
          transport: {
            host: emailConfig?.host,
            port: emailConfig?.port,
            auth: {
              user: emailConfig?.username,
              pass: emailConfig?.password,
            },
          },
          defaults: {
            from: `"${emailConfig?.fromName}" <${emailConfig?.from}>`,
          },
          template: {
            dir: path.join(
              process.cwd(),
              'src',
              'modules',
              'email',
              'templates',
            ),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
    }),
  ],
  exports: [MailerModule],
})
export class NodeMailerConfigModule {}
