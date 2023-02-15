import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { err, ok } from 'neverthrow';

import { EmailTemplate } from '@/common/constants/email-template.constant';
import { ServiceException } from '@/common/exceptions/service.exception';

@Injectable()
export class EmailProducerService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(@InjectQueue('sendMail') private queue: Queue) {}

  public async sendVerificationEmail(data: {
    email: string;
    code: string;
    username: string;
    expireDate: string;
  }) {
    try {
      this.queue.add('confirmation', {
        to: data.email,
        subject: 'Confirm your email',
        template: EmailTemplate.VERIFICATION_EMAIL,
        context: {
          code: data.code,
          name: data.username,
          expire: data.expireDate,
        },
      });

      return ok(true);
    } catch (e) {
      this.logger.error('Error queueing confirmation email to user.');

      return err(new ServiceException('QUEUE_ERROR'));
    }
  }

  public async sendResetPasswordEmail(data: {
    email: string;
    code: string;
    expireDate: string;
  }) {
    try {
      this.queue.add('reset-password', {
        to: data.email,
        subject: 'Reset your password',
        template: EmailTemplate.RESET_PASSWORD_EMAIL,
        context: {
          code: data.code,
          email: data.email,
          expire: data.expireDate,
        },
      });

      return ok(true);
    } catch (e) {
      this.logger.error('Error queueing reset email to user.');

      return err(new ServiceException('QUEUE_ERROR'));
    }
  }
}
