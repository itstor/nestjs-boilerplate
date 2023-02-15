import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

import { ConfigName } from '@/common/constants/config-name.constant';
import JoiEnvValidator, { JoiConfig } from '@/common/helpers/joi-env.utils';

export interface IThrottleConfig {
  ttl: number;
  limit: number;
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
  };

  return JoiEnvValidator.validate(config);
});
