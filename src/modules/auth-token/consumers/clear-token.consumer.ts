import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as Sentry from '@sentry/node';
import { Job } from 'bull';
import * as dayjs from 'dayjs';
import { LessThan, Repository } from 'typeorm';

import { RefreshToken } from '@/entities/resfresh-token.entity';

@Processor('clearToken')
export class ClearTokenConsumer {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @InjectRepository(RefreshToken)
    private readonly tokenRepo: Repository<RefreshToken>,
  ) {}

  @OnQueueActive()
  onActive() {
    this.logger.log('Deleting expired tokens from the database.');
  }

  @OnQueueCompleted()
  onComplete() {
    this.logger.log('Successfully deleted expired tokens from the database.');
  }

  @OnQueueFailed()
  onError(job: Job<any>, error: Error) {
    this.logger.error(
      `Failed to delete expired tokens from the database, with error: ${error.message}`,
      error.stack,
    );
    Sentry.captureException(error);
  }

  @Process('clear-expired')
  async clearExpiredToken() {
    try {
      await this.tokenRepo.delete({
        expiredOn: LessThan(dayjs().toDate()),
      });
    } catch (error) {
      throw error;
    }
  }
}
