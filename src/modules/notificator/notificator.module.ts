import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import { NotificatorConsumerService } from './notificator.consumer';
import { NotificatorProducerService } from './notificator.producer.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'notificator',
      defaultJobOptions: {
        removeOnComplete: true,
      },
    }),
  ],
  providers: [NotificatorProducerService, NotificatorConsumerService],
  exports: [NotificatorProducerService],
})
export class NotificatorModule {}
