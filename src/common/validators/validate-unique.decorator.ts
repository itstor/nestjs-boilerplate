import { registerDecorator, ValidationArguments } from 'class-validator';
import { BaseEntity } from 'typeorm';

import APIError from '../exceptions/api-error.exception';

export function ValidateUnique(
  field: string,
  model: typeof BaseEntity,
  error: APIError,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'validateUnique',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [field],
      validator: {
        async validate(value: any, _args: ValidationArguments) {
          const record = await model.findOne({ where: { [field]: value } });
          if (record) throw error;
          return true;
        },
      },
    });
  };
}
