import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

import { ConfigName } from '@/common/constants/config-name.constant';
import JoiEnvValidator, { JoiConfig } from '@/common/helpers/joi-env.utils';

export interface IJWTConfig {
  secret: string;
  accessExpirationMinutes: number;
  refreshExpirationDays: number;
}

export default registerAs(ConfigName.JWT, (): IJWTConfig => {
  const config: JoiConfig<IJWTConfig> = {
    secret: {
      value: process.env.JWT_SECRET,
      joi: Joi.string().required(),
    },
    accessExpirationMinutes: {
      value: parseInt(process.env.JWT_ACCESS_EXPIRATION_MINUTES || '30', 10),
      joi: Joi.number().required(),
    },
    refreshExpirationDays: {
      value: parseInt(process.env.JWT_REFRESH_EXPIRATION_DAYS || '30', 10),
      joi: Joi.number().required(),
    },
  };

  return JoiEnvValidator.validate(config);
});
