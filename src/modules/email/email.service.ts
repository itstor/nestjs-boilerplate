import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Queue } from 'bull';
import { err, ok } from 'neverthrow';

import { ServiceException } from '@/common/exceptions/service.exception';
import { Users } from '@/entities/users.entity';

export interface IEmailData {
  to: string;
  subject: string;
  template: string;
  context: Record<string, unknown>;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @InjectQueue('sendMail')
    private mailQueue: Queue,
    private readonly mailerService: MailerService,
  ) {}

  public async sendVerificationEmail(user: Users) {
    const code = '20232'; // Geneerate OTP
    try {
      this.mailQueue.add('confirmation', {
        to: user.email,
        subject: 'Confirm your email',
        template: './verification-email',
        context: {
          code: code,
          name: user.username,
        },
      });

      return ok(true);
    } catch (e) {
      this.logger.error('Error queueing confirmation email to user.');

      return err(new ServiceException('QUEUE_ERROR'));
    }
  }
  public async sendEmail(data: IEmailData) {
    await this.mailerService.sendMail({
      to: data.to,
      subject: data.subject,
      template: data.template,
      context: data.context,
    });
  }
}
