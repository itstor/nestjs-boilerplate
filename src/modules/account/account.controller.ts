import { Body, Controller, Get, HttpCode, Post, Session } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { ApiErrorMessage } from '@/common/constants/api-error-message.constant';
import APIError from '@/common/exceptions/api-error.exception';

import { AccountService } from './account.service';
import { RecoverPasswordDTO } from './dto/recover-password.dto';

@Controller({
  path: 'account',
  version: '1',
})
@ApiTags('User Account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('forgot-password')
  @Throttle(2, 60) // 2 recover request per minute
  @HttpCode(200)
  @ApiOperation({ operationId: 'Forgot Password' })
  @ApiNotFoundResponse({ description: 'User with email not found' })
  @ApiOkResponse({ description: 'Success message' })
  @ApiTooManyRequestsResponse({
    description: 'Only 2 recover request per minute',
  })
  async recover(
    @Session() session: { recoverPassword: string },
    @Body() body: RecoverPasswordDTO,
  ) {
    const result = await this.accountService.recoverPassword(body.email);

    if (result.isErr()) {
      const error = result.error;

      switch (error.name) {
        case 'USER_NOT_FOUND':
          throw APIError.fromMessage(ApiErrorMessage.WRONG_EMAIL);
      }
    }

    const {
      otp: { id, expiredOn },
      ttl,
      allowResendIn,
    } = result.value;

    session.recoverPassword = id;

    return {
      message: 'Recover password email sent',
      expiredOn: expiredOn,
      ttl: ttl,
      allowResendIn: allowResendIn,
    };
  }

  @Post('reset-password/verify')
  @HttpCode(200)
  @ApiOperation({ operationId: 'Verify Recover User Account' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiOkResponse({ description: 'Success message' })
  async verifyRecover(
    @Session()
    session: { recoverPassword: string; recoverPasswordVerified: boolean },
    @Body() body: { otp: string },
  ) {
    // const isVerified = await this.otp
  }

  @Get('test')
  async test(@Session() session: any) {
    console.log(session);
    return { message: 'test' };
  }
}
