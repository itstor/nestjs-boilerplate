import { HttpStatus } from '@nestjs/common';

import APIError from '@/common/exceptions/api-error.exception';

export default class UsernameTakenException extends APIError {
  constructor() {
    super(
      { code: 'USERNAME_TAKEN', message: 'Username is already taken' },
      HttpStatus.CONFLICT,
    );
  }
}
