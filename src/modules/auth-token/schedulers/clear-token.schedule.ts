import { InjectQueue } from '@nestjs/bull';
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class ClearTokenSchedule implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(this.constructor.name);
  private readonly time = '0 2 * * *'; // 2:00 AM WIB every day

  constructor(@InjectQueue('clearToken') private queue: Queue) {}

  onModuleInit() {
    this.logger.log(`Scheduling clear tokens job to run at ${this.time}.`);

    this.queue.add('clear-expired', {}, { repeat: { cron: this.time } });
  }

  onModuleDestroy() {
    this.logger.log('Removing clear tokens job from the schedule.');

    this.queue.removeRepeatable('clear-expired', { cron: this.time });
  }
}
