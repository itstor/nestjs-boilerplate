import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

import { ConfigName } from '@/common/constants/config-name.constant';
import JoiEnvValidator, { JoiConfig } from '@/common/helpers/joi-env.utils';

export interface IRedisConfig {
  redis_url: string;
}

export default registerAs(ConfigName.REDIS, (): IRedisConfig => {
  const config: JoiConfig<IRedisConfig> = {
    redis_url: {
      value: process.env.REDIS_URL,
      joi: Joi.string().required(),
    },
  };

  return JoiEnvValidator.validate(config);
});
