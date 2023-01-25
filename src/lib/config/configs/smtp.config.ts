import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

import { ConfigName } from '@/common/constants/config-name.constant';
import JoiEnvValidator, { JoiConfig } from '@/common/helpers/joi-env.utils';

export interface ISMTPConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  from: string;
  fromName: string;
}

export default registerAs(ConfigName.SMTP, (): ISMTPConfig => {
  const config: JoiConfig<ISMTPConfig> = {
    host: {
      value: process.env.SMTP_HOST,
      joi: Joi.string().required(),
    },
    port: {
      value: parseInt(process.env.SMTP_PORT || '587', 10),
      joi: Joi.number().required(),
    },
    username: {
      value: process.env.SMTP_USERNAME,
      joi: Joi.string().required(),
    },
    password: {
      value: process.env.SMTP_PASSWORD,
      joi: Joi.string().required(),
    },
    from: {
      value: process.env.EMAIL_FROM,
      joi: Joi.string().required(),
    },
    fromName: {
      value: process.env.EMAIL_FROM_NAME,
      joi: Joi.string().required(),
    },
  };

  return JoiEnvValidator.validate(config);
});
