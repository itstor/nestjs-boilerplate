import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

import JoiEnvConfig, { JoiConfig } from '@/common/helpers/joi-env.utils';

export interface IRedisEnvConfig {
  host: string;
  port: number;
}

export default registerAs('redis-config', (): IRedisEnvConfig => {
  const config: JoiConfig<IRedisEnvConfig> = {
    host: {
      value: process.env.REDIS_HOST,
      joi: Joi.string().required(),
    },
    port: {
      value: parseInt(process.env.REDIS_PORT || '6379', 10),
      joi: Joi.number().required(),
    },
  };

  return JoiEnvConfig.validate(config);
});
