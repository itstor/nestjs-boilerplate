import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { DatabaseType } from 'typeorm';

import { ConfigName } from '@/common/constants/config-name.constant';
import JoiEnvValidator, { JoiConfig } from '@/common/helpers/joi-env.utils';

export interface IDatabaseConfig {
  type: DatabaseType;
  url: string;
}

export default registerAs(ConfigName.DB, (): IDatabaseConfig => {
  const config: JoiConfig<IDatabaseConfig> = {
    type: {
      value: process.env.DB_TYPE as DatabaseType,
      joi: Joi.string().required(),
    },
    url: {
      value: process.env.DB_URL,
      joi: Joi.string().required(),
    },
  };

  return JoiEnvValidator.validate(config);
});
