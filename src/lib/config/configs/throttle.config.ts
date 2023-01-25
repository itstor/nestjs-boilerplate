import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

import { ConfigName } from '@/common/constants/config-name.constant';
import JoiEnvValidator, { JoiConfig } from '@/common/helpers/joi-env.utils';

export interface IThrottleConfig {
  ttl: number;
  limit: number;
  redis_url: string;
}

export default registerAs(ConfigName.THROTTLE, (): IThrottleConfig => {
  const config: JoiConfig<IThrottleConfig> = {
    ttl: {
      value: parseInt(process.env.THROTTLE_TTL || '60', 10),
      joi: Joi.number().required(),
    },
    limit: {
      value: parseInt(process.env.THROTTLE_LIMIT || '10', 10),
      joi: Joi.number().required(),
    },
    redis_url: {
      value: process.env.THROTTLE_REDIS_URL,
      joi: Joi.string().required(),
    },
  };

  return JoiEnvValidator.validate(config);
});
