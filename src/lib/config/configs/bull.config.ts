import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

import { ConfigName } from '@/common/constants/config-name.constant';
import JoiEnvValidator, { JoiConfig } from '@/common/helpers/joi-env.utils';

export interface IBullConfig {
  redis_url: string;
}

export default registerAs(ConfigName.BULL, (): IBullConfig => {
  const config: JoiConfig<IBullConfig> = {
    redis_url: {
      value: process.env.BULL_REDIS_URL,
      joi: Joi.string().required(),
    },
  };

  return JoiEnvValidator.validate(config);
});
