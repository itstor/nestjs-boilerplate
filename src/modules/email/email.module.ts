import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import { EmailService } from './email.service';
import { EmailProcessor } from './processors/email.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'sendMail',
    }),
  ],
  providers: [EmailService, EmailProcessor],
  exports: [EmailService],
})
export class EmailModule {}
