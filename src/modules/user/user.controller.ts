import { Controller, Head, HttpStatus, Param, Res } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';

import { ApiErrorMessage } from '@/common/constants/api-error-message.constant';
import APIError from '@/common/exceptions/api-error.exception';

import { UserService } from './user.service';

@Controller({
  path: 'users',
  version: '1',
})
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Head('username/:username')
  @ApiOperation({ operationId: 'Check Username Availability' })
  @ApiOkResponse({
    description: 'Username available',
  })
  @ApiConflictResponse({
    description: 'Username already taken',
  })
  async checkUsernameAvailability(
    @Param('username') username: string,
    @Res() res: Response,
  ) {
    const result = await this.userService.findOne({ username });

    if (result) {
      throw APIError.fromMessage(ApiErrorMessage.USERNAME_EXISTS);
    }

    res.sendStatus(HttpStatus.OK);
  }

  @Head('email/:email')
  @ApiOperation({ operationId: 'Check Email Availability' })
  @ApiOkResponse({
    description: 'Email available',
  })
  @ApiConflictResponse({
    description: 'Email already taken',
  })
  async checkEmailAvailability(
    @Param('email') email: string,
    @Res() res: Response,
  ) {
    const result = await this.userService.findOne({ email });

    if (result) {
      throw APIError.fromMessage(ApiErrorMessage.USER_EMAIL_REGISTERED);
    }

    res.sendStatus(HttpStatus.OK);
  }
}
