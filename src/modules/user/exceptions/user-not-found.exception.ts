import { HttpStatus } from '@nestjs/common';

import APIError from '@/common/exceptions/api-error.exception';

export default class UserNotFoundException extends APIError {
  constructor() {
    super(
      { code: 'USER_NOT_FOUND', message: 'User not found' },
      HttpStatus.NOT_FOUND,
    );
  }
}
