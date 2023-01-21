import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

import JoiEnvConfig, { JoiConfig } from '@/common/helpers/joi-env.utils';

export interface IKeyConfig {
  refreshSecretKey: string;
}

export default registerAs('key-config', (): IKeyConfig => {
  const config: JoiConfig<IKeyConfig> = {
    refreshSecretKey: {
      value: process.env.REFRESH_SECRET_KEY,
      joi: Joi.string().required(),
    },
  };

  return JoiEnvConfig.validate(config);
});
