import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import { SendEmailConsumer } from './consumers/email.consumer';
import { EmailProducerService } from './producers/email.producer.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'sendMail',
      defaultJobOptions: {
        removeOnComplete: true,
      },
    }),
  ],
  providers: [EmailProducerService, SendEmailConsumer],
  exports: [EmailProducerService],
})
export class EmailModule {}
