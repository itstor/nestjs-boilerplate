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

import { OTP } from '@/entities/otp.entity';

@Processor('clearOTP')
export class ClearOTPConsumer {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @InjectRepository(OTP)
    private readonly otpRepo: Repository<OTP>,
  ) {}

  @OnQueueActive()
  onActive() {
    this.logger.log('Deleting expired OTP from the database.');
  }

  @OnQueueCompleted()
  onComplete() {
    this.logger.log('Successfully deleted expired OTP from the database.');
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
      await this.otpRepo.delete({
        expiredOn: LessThan(dayjs().add(10, 'minute').toDate()), // Tolerate 10 minutes
      });
    } catch (error) {
      throw error;
    }
  }
}
