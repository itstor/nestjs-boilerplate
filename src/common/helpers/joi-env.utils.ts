//Reference: https://dev.to/rrgt19/ways-to-validate-environment-configuration-in-a-forfeature-config-in-nestjs-2ehp

import * as Joi from 'joi';

interface ConfigProps {
  value: unknown;
  joi: Joi.Schema;
}

export type JoiConfig<T> = Record<keyof T, ConfigProps>;

export default class JoiEnvValidator {
  static validate<T>(config: JoiConfig<T>): T {
    const schemaObj = JoiEnvValidator.extractByPropName(
      config,
      'joi',
    ) as Joi.SchemaMap<T>;
    const schema = Joi.object(schemaObj);
    const values = JoiEnvValidator.extractByPropName(config, 'value') as T;

    const { error } = schema.validate(values, { abortEarly: false });
    if (error) {
      throw new Error(error.message);
    }

    return values;
  }

  static extractByPropName<T>(
    config: JoiConfig<T>,
    propName: keyof ConfigProps,
  ): T | Joi.SchemaMap<T> {
    const arr: any[] = Object.keys(config).map((key) => {
      return {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        [key]: config[key][propName],
      };
    });

    return Object.assign({}, ...arr);
  }
}
