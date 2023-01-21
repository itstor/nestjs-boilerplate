import {
  registerDecorator,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ValidationOptions } from 'joi';

@ValidatorConstraint({ async: true })
class IsUsernameConstraint implements ValidatorConstraintInterface {
  async validate(value: string, _argument: ValidationArguments) {
    return /^[A-Za-z][\w.]{5,12}/.test(value);
  }

  defaultMessage(_argument: ValidationArguments) {
    return `Username must be 5-12 characters long, start with a letter, and can only contain letters, numbers, underscores, and periods.`;
  }
}

export const IsUsername = (validationOptions?: ValidationOptions) => {
  return function (object: Record<string, any>, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUsernameConstraint,
    });
  };
};
