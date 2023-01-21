import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

import JoiEnvConfig, { JoiConfig } from '@/common/helpers/joi-env.utils';

export interface IAppEnvConfig {
  environment: 'development' | 'production';
  isProduction: boolean;
  port: number;
  swaggerEnabled: boolean;
}

export default registerAs('app-env', (): IAppEnvConfig => {
  const config: JoiConfig<IAppEnvConfig> = {
    environment: {
      value: process.env.NODE_ENV,
      joi: Joi.string().valid('development', 'production').required(),
    },
    isProduction: {
      value: process.env.NODE_ENV === 'production',
      joi: Joi.boolean().required(),
    },
    port: {
      value: parseInt(process.env.PORT || '3000', 10),
      joi: Joi.number().required(),
    },
    swaggerEnabled: {
      value: process.env.SWAGGER_ENABLED === 'true',
      joi: Joi.boolean().required(),
    },
  };

  return JoiEnvConfig.validate(config);
});
