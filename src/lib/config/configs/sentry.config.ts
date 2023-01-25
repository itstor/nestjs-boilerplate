import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

import { ConfigName } from '@/common/constants/config-name.constant';
import JoiEnvValidator, { JoiConfig } from '@/common/helpers/joi-env.utils';

export interface ISentryConfig {
  enabled: boolean;
  dsn: string;
}

export default registerAs(ConfigName.SENTRY, (): ISentryConfig => {
  const config: JoiConfig<ISentryConfig> = {
    enabled: {
      value: process.env.SENTRY_ENABLED === 'true',
      joi: Joi.boolean().required(),
    },
    dsn: {
      value: process.env.SENTRY_DSN,
      joi: Joi.string().required(),
    },
  };

  return JoiEnvValidator.validate(config);
});
