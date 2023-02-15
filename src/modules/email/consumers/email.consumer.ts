import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as Sentry from '@sentry/node';
import { Job } from 'bull';

@Processor('sendMail')
export class SendEmailConsumer {
  private readonly logger = new Logger(this.constructor.name);

  constructor(private readonly mailerService: MailerService) {}

  private async sendEmail(data: {
    to: string;
    subject: string;
    template: string;
    context: Record<string, any>;
  }) {
    await this.mailerService.sendMail({
      to: data.to,
      subject: data.subject,
      template: data.template,
      context: data.context,
    });
  }

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
    this.logger.error(
      `Failed job ${job.id} of type ${job.name}: ${error.message}`,
      error.stack,
    );
    Sentry.captureException(error);
  }

  @Process('confirmation')
  async sendConfirmationEmail(job: Job): Promise<any> {
    this.logger.log('Sending confirmation email.');

    try {
      const result = await this.sendEmail(job.data);

      return result;
    } catch (error) {
      this.logger.error('Failed to send confirmation email.', error.stack);

      throw error;
    }
  }

  @Process('reset-password')
  async sendResetPasswordEmail(job: Job): Promise<any> {
    this.logger.log('Sending reset password email.');

    try {
      const result = await this.sendEmail(job.data);

      return result;
    } catch (error) {
      this.logger.error('Failed to send reset password email.', error.stack);

      throw error;
    }
  }
}
