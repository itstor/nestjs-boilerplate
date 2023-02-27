import { Body, Controller, Get, HttpCode, Post, Req } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Request } from 'express';

import { ApiErrorMessage } from '@/common/constants/api-error-message.constant';
import { LoggedUser } from '@/common/decorators/logged-user.decorator';
import { UseAuth } from '@/common/decorators/use-auth.decorator';
import APIError from '@/common/exceptions/api-error.exception';
import { User } from '@/entities/user.entity';

import { AccountService } from './account.service';
import { RecoverPasswordDTO } from './dto/recover-password.dto';
import { ResetForgotPasswordDTO } from './dto/reset-forgot-password.dto';
import { UpdateEmailDTO } from './dto/update-email.dto';
import { UpdatePasswordDTO } from './dto/update-password.dto';
import { UpdateUsernamelDTO } from './dto/update-username.dto';
import { VerifyEmailDTO } from './dto/verify-email.dto';
import { VerifyResetPasswordOTPDTO } from './dto/verify-reset-password-otp.dto';

@Controller({
  path: 'account',
  version: '1',
})
@ApiTags('User Account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('me')
  @UseAuth()
  @ApiOperation({ operationId: 'Get User Info' })
  @ApiOkResponse({ description: 'User Info' })
  async getMe(@LoggedUser() user: User) {
    return user;
  }

  @Post('password/forgot')
  @Throttle(2, 60) // 2 recover request per minute
  @HttpCode(200)
  @ApiOperation({ operationId: 'Forgot Password' })
  @ApiNotFoundResponse({ description: 'User with email not found' })
  @ApiOkResponse({ description: 'Success message' })
  @ApiTooManyRequestsResponse({
    description: 'Only 2 recover request per minute',
  })
  async forgotPassword(@Req() req: Request, @Body() body: RecoverPasswordDTO) {
    const result = await this.accountService.requestForgotPassword(
      body.email,
      req.cookies.tz,
    );

    if (result.isErr()) {
      const error = result.error;

      switch (error.name) {
        case 'EMAIL_NOT_FOUND':
          throw APIError.fromMessage(ApiErrorMessage.WRONG_EMAIL);
        case 'RESEND_OTP_NOT_ALLOWED':
          throw APIError.fromMessage(ApiErrorMessage.RESEND_OTP_NOT_ALLOWED);
      }
    }

    const {
      otp: { expiredOn },
      token,
      ttl,
      allowResendIn,
    } = result.value;

    return {
      message: 'Recover password email sent',
      token,
      expiredOn: expiredOn,
      ttl: ttl,
      allowResendIn: allowResendIn,
    };
  }

  @Post('password/forgot/verify')
  @HttpCode(200)
  @ApiOperation({ operationId: 'Verify Recover User Account' })
  @ApiUnauthorizedResponse({ description: 'Invalid OTP' })
  @ApiOkResponse({ description: 'OTP Verified' })
  async verifyResetOTP(@Body() body: VerifyResetPasswordOTPDTO) {
    const isValid = await this.accountService.verifyResetPasswordOTP(body);

    if (isValid.isErr()) {
      const error = isValid.error;

      switch (error.name) {
        case 'OTP_INVALID':
          throw APIError.fromMessage(ApiErrorMessage.INVALID_OTP);
        case 'TOKEN_INVALID':
          throw APIError.fromMessage(ApiErrorMessage.INVALID_OTP_TOKEN);
      }
    }

    return {
      message: 'OTP verified',
      token: body.token,
    };
  }

  @Post('password/forgot/reset')
  @HttpCode(200)
  @ApiOperation({ operationId: 'Reset User Account Password' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiOkResponse({ description: 'Success message' })
  async resetPassword(@Body() body: ResetForgotPasswordDTO) {
    const result = await this.accountService.resetPassword({
      token: body.token,
      password: body.password,
    });

    if (result.isErr()) {
      const error = result.error;

      switch (error.name) {
        case 'OTP_NOT_FOUND':
        case 'TOKEN_INVALID':
          throw APIError.fromMessage(ApiErrorMessage.INVALID_OTP_TOKEN);
        case 'OTP_NOT_VERIFIED':
          throw APIError.fromMessage(ApiErrorMessage.VERIFY_OTP_FIRST);
      }
    }

    return {
      message: 'Password reset success',
    };
  }

  @Get('password/linked')
  @UseAuth()
  @HttpCode(200)
  @ApiOperation({
    operationId: 'Check Linked Password',
    description:
      'Check if user has been linked their password. This supposed to be called to determine change password flow.',
  })
  async checkLinkedPassword(@LoggedUser() user: User) {
    const result = await this.accountService.checkLinkedPassword(user.id);

    if (result.isErr()) {
      const error = result.error;

      switch (error.name) {
        case 'USER_NOT_FOUND':
          throw APIError.fromMessage(ApiErrorMessage.USER_NOT_FOUND);
      }
    }

    const isLinked = result.value;

    return {
      linked: isLinked,
    };
  }

  @Post('email/send-verification')
  @UseAuth()
  @HttpCode(200)
  @ApiOperation({ operationId: 'Request Email Verification' })
  @ApiOkResponse({ description: 'Success message' })
  async sendEmailVerification(@Req() req: Request, @LoggedUser() user: User) {
    const result = await this.accountService.sendEmailVerification(
      user,
      req.cookies.tz,
    );

    if (result.isErr()) {
      const error = result.error;

      switch (error.name) {
        case 'RESEND_OTP_NOT_ALLOWED':
          throw APIError.fromMessage(ApiErrorMessage.RESEND_OTP_NOT_ALLOWED);
        case 'EMAIL_ALREADY_VERIFIED':
          throw APIError.fromMessage(ApiErrorMessage.EMAIL_ALREADY_VERIFIED);
      }
    }

    const { allowResendIn } = result.value;

    return {
      message: 'Email verification sent',
      allowResendIn,
    };
  }

  @Post('email/verify')
  @UseAuth()
  @HttpCode(200)
  @ApiOperation({ operationId: 'Verify Email' })
  @ApiOkResponse({ description: 'Success message' })
  async verifyEmail(@Body() body: VerifyEmailDTO, @LoggedUser() user: User) {
    const result = await this.accountService.verifyEmail(user, body.otp);

    if (result.isErr()) {
      const error = result.error;

      switch (error.name) {
        case 'OTP_INVALID':
          throw APIError.fromMessage(ApiErrorMessage.INVALID_OTP);
        case 'EMAIL_ALREADY_VERIFIED':
          throw APIError.fromMessage(ApiErrorMessage.EMAIL_ALREADY_VERIFIED);
      }

      throw APIError.fromMessage(ApiErrorMessage.OPERATION_FAILED, error.cause);
    }

    return result.value;
  }

  @Post('email')
  @UseAuth()
  @HttpCode(200)
  @ApiOperation({ operationId: 'Update Email' })
  @ApiOkResponse({ description: 'Success message' })
  async updateEmail(@Body() body: UpdateEmailDTO, @LoggedUser() user: User) {
    const updatedUser = await this.accountService.updateEmail(
      user,
      body.newEmail,
    );

    if (updatedUser.isErr()) {
      const error = updatedUser.error;

      switch (error.name) {
        case 'EMAIL_EXISTS':
          throw APIError.fromMessage(ApiErrorMessage.EMAIL_EXISTS);
        case 'EMAIL_SAME':
          throw APIError.fromMessage(ApiErrorMessage.EMAIL_SAME_AS_OLD);
      }

      throw APIError.fromMessage(ApiErrorMessage.OPERATION_FAILED, error.cause);
    }

    return updatedUser.value;
  }

  @Post('username')
  @UseAuth()
  @HttpCode(200)
  @ApiOperation({ operationId: 'Update Username' })
  @ApiOkResponse({ description: 'Updated User' })
  async updateUsername(
    @LoggedUser() user: User,
    @Body() body: UpdateUsernamelDTO,
  ) {
    const updatedUser = await this.accountService.updateUsername(
      user,
      body.newUsername,
    );

    if (updatedUser.isErr()) {
      const error = updatedUser.error;

      switch (error.name) {
        case 'USERNAME_EXISTS':
          throw APIError.fromMessage(ApiErrorMessage.USERNAME_EXISTS);
        case 'USERNAME_SAME_AS_OLD':
          throw APIError.fromMessage(ApiErrorMessage.USERNAME_SAME_AS_OLD);
      }

      throw APIError.fromMessage(ApiErrorMessage.OPERATION_FAILED, error.cause);
    }

    return updatedUser.value;
  }

  @Post('password')
  @UseAuth()
  @HttpCode(200)
  @ApiOperation({ operationId: 'Update Password' })
  @ApiOkResponse({ description: 'Updated User' })
  async updatePassword(
    @LoggedUser() user: User,
    @Body() body: UpdatePasswordDTO,
  ) {
    const result = await this.accountService.updatePassword(
      user.id,
      body.newPassword,
      body.oldPassword,
    );

    if (result.isErr()) {
      const error = result.error;

      switch (error.name) {
        case 'PASSWORD_NOT_MATCH':
          throw APIError.fromMessage(ApiErrorMessage.WRONG_PASSWORD);
        case 'OLD_PASSWORD_REQUIRED':
          throw APIError.fromMessage(ApiErrorMessage.OLD_PASSWORD_REQUIRED);
      }

      throw APIError.fromMessage(ApiErrorMessage.OPERATION_FAILED, error.cause);
    }

    return result.value;
  }
}
