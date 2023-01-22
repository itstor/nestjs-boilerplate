import { HttpException } from '@nestjs/common';

import {
  ApiErrorCode,
  IApiErrorMessage,
} from '../constants/api-error-code.constant';

export interface IAPIError {
  code: string;
  message: any;
}

export default class APIError extends HttpException {
  constructor(response: IAPIError, status: number) {
    super(response, status);
  }

  public static fromCode(errorCode: keyof typeof ApiErrorCode) {
    const { code, message, httpCode } = ApiErrorCode[errorCode];

    return new APIError({ code, message }, httpCode);
  }

  public static fromMessage(errorCode: IApiErrorMessage) {
    const { code, message, httpCode } = errorCode;

    return new APIError({ code, message }, httpCode);
  }
}
