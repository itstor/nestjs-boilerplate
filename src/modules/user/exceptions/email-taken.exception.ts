import { HttpStatus } from '@nestjs/common';

import APIError from '@/common/exceptions/api-error.exception';

export default class EmailTakenException extends APIError {
  constructor() {
    super(
      { code: 'EMAIl_TAKEN', message: 'Email is already taken' },
      HttpStatus.CONFLICT,
    );
  }
}
