import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

import { ConfigName } from '@/common/constants/config-name.constant';
import JoiEnvValidator, { JoiConfig } from '@/common/helpers/joi-env.utils';

// TODO Delete???
export interface IKeyConfig {
  refreshSecretKey: string;
}

export default registerAs(ConfigName.KEY, (): IKeyConfig => {
  const config: JoiConfig<IKeyConfig> = {
    refreshSecretKey: {
      value: process.env.REFRESH_SECRET_KEY,
      joi: Joi.string().required(),
    },
  };

  return JoiEnvValidator.validate(config);
});
