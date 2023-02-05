import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import { SendEmailConsumer } from './consumers/send-email.consumer';
import { SendEmailProducerService } from './producers/send-email.producer.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'sendMail',
      defaultJobOptions: {
        removeOnComplete: true,
      },
    }),
  ],
  providers: [SendEmailProducerService, SendEmailConsumer],
  exports: [SendEmailProducerService],
})
export class EmailModule {}
