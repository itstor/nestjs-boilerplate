import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

import { EmailService } from '../email.service';

@Processor('sendMail')
export class EmailProcessor {
  private readonly logger = new Logger(this.constructor.name);

  constructor(private readonly mailService: EmailService) {}

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.log(
      `Processing job ${job.id} of type ${job.name}. Data: ${JSON.stringify(
        job.data,
      )}`,
    );
  }

  @OnQueueCompleted()
  onComplete(job: Job) {
    this.logger.log(`Completed job ${job.id} of type ${job.name}.`);
  }

  @OnQueueFailed()
  onError(job: Job<any>, error: Error) {
    this.logger.log(
      `Failed job ${job.id} of type ${job.name}: ${error.message}`,
      error.stack,
    );
  }

  @Process('confirmation')
  async sendConfirmationEmail(job: Job): Promise<any> {
    this.logger.log('Sending confirmation email.');

    try {
      const result = await this.mailService.sendEmail(job.data);

      return result;
    } catch (error) {
      this.logger.error('Failed to send confirmation email.', error.stack);

      throw error;
    }
  }
}
