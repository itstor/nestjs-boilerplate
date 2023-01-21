import {
  HttpStatus,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';

import APIError from '../exceptions/api-error.exception';

export default class RequestValidationPipe extends ValidationPipe {
  constructor(validationOptions?: ValidationPipeOptions) {
    const options = validationOptions ?? {};

    options.exceptionFactory = (errors) => {
      const messages = errors.map((error) => {
        if (error.constraints) {
          const constraints = Object.values(error.constraints);
          return constraints[0];
        }
      });

      return new APIError(
        { message: messages, code: 'VALIDATION_ERROR' },
        HttpStatus.BAD_REQUEST,
      );
    };
    super(validationOptions);
  }
}
