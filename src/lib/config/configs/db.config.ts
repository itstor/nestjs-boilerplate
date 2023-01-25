import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { DatabaseType } from 'typeorm';

import { ConfigName } from '@/common/constants/config-name.constant';
import JoiEnvValidator, { JoiConfig } from '@/common/helpers/joi-env.utils';

export interface IDatabaseConfig {
  type: DatabaseType;
  host: string;
  port: number;
  username: string;
  password: string;
  name: string;
}

export default registerAs(ConfigName.DB, (): IDatabaseConfig => {
  const config: JoiConfig<IDatabaseConfig> = {
    type: {
      value: process.env.DB_TYPE as DatabaseType,
      joi: Joi.string().required(),
    },
    host: {
      value: process.env.DB_HOST,
      joi: Joi.string().required(),
    },
    port: {
      value: parseInt(process.env.DB_PORT || '5432', 10),
      joi: Joi.number().required(),
    },
    username: {
      value: process.env.DB_USERNAME,
      joi: Joi.string().required(),
    },
    password: {
      value: process.env.DB_PASSWORD,
      joi: Joi.string().required(),
    },
    name: {
      value: process.env.DB_NAME,
      joi: Joi.string().required(),
    },
  };

  return JoiEnvValidator.validate(config);
});
