import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request, Response } from 'express';

import { ApiErrorMessage } from '@/common/constants/api-error-message.constant';
import { UseAuth } from '@/common/decorators/use-auth.decorator';
import APIError from '@/common/exceptions/api-error.exception';

import { AuthService } from './auth.service';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';

@Controller({ path: 'auth', version: '1' })
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ operationId: 'Login User' })
  @ApiOkResponse({
    description: 'Return user data and access token',
  })
  @ApiUnauthorizedResponse({
    description: 'Wrong email or password',
  })
  async login(
    @Body() body: UserLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(body);

    if (result.isErr()) {
      const error = result.error;

      switch (error.message) {
        case 'USER_NOT_FOUND':
          throw APIError.fromMessage(ApiErrorMessage.USER_NOT_FOUND);
        case 'WRONG_PASSWORD':
          throw APIError.fromMessage(ApiErrorMessage.WRONG_PASSWORD);
        default:
          throw APIError.fromMessage(ApiErrorMessage.INTERNAL_SERVER_ERROR);
      }
    }

    const loginData = result.value;

    res.cookie('_rtoken', loginData.refresh.token, {
      httpOnly: true,
      expires: loginData.refresh.expires,
      sameSite: 'strict',
      secure: true,
    });

    return {
      user: loginData.user,
      access: {
        token: loginData.access.token,
        expires: loginData.access.expires,
      },
    };
  }

  @Get('logout')
  @ApiOperation({ operationId: 'Logout User' })
  @ApiOkResponse({
    description: 'Return success message',
  })
  @ApiUnauthorizedResponse({
    description: 'User is not logged in',
  })
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies._rtoken;

    if (!token) {
      throw APIError.fromMessage(ApiErrorMessage.NOT_LOGGED);
    }

    await this.authService.logout(token);

    res.clearCookie('_rtoken');

    return {
      message: 'Logout successful',
    };
  }

  @Post('register')
  @ApiOperation({ operationId: 'Register User' })
  @ApiOkResponse({
    description: 'Return user data and access token',
  })
  @ApiConflictResponse({
    description: 'User already registered',
  })
  async register(
    @Body() body: UserRegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.register(body);

    if (result.isErr()) {
      const error = result.error;

      switch (error.message) {
        case 'USER_EXISTS':
          throw APIError.fromMessage(ApiErrorMessage.USER_REGISTERED);
        case 'USERNAME_EXISTS':
          throw APIError.fromMessage(ApiErrorMessage.USERNAME_EXISTS);
        default:
          throw APIError.fromMessage(ApiErrorMessage.INTERNAL_SERVER_ERROR);
      }
    }

    const registerData = result.value;

    res.cookie('_rtoken', registerData.refresh.token, {
      httpOnly: true,
      expires: registerData.refresh.expires,
      sameSite: 'strict',
      secure: true,
    });

    return {
      user: registerData.user,
      access: {
        token: registerData.access.token,
        expires: registerData.access.expires,
      },
    };
  }

  @Get('refresh')
  @ApiOperation({ operationId: 'Refresh Access Token' })
  @ApiOkResponse({
    description: 'Return new access token',
  })
  @ApiUnauthorizedResponse({
    description: 'User is not logged in',
  })
  async refresh(@Req() req: Request) {
    const token = req.cookies._rtoken;

    if (!token) {
      throw APIError.fromMessage(ApiErrorMessage.NOT_LOGGED);
    }

    const result = await this.authService.refresh(token);

    if (result.isErr()) {
      throw APIError.fromMessage(ApiErrorMessage.TOKEN_EXPIRED);
    }

    const accessToken = result.value;

    return {
      access: {
        token: accessToken.token,
        expires: accessToken.expires,
      },
    };
  }

  @UseAuth()
  @Get('logout/devices')
  @ApiOperation({ operationId: 'Logout User from all devices' })
  @ApiOkResponse({
    description: 'Return success message and clear refresh token cookie',
  })
  async logoutDevices(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = req.cookies._rtoken;

    if (!token) {
      throw APIError.fromMessage(ApiErrorMessage.NOT_LOGGED);
    }

    await this.authService.logout(token, true);

    res.clearCookie('_rtoken');

    return {
      message: 'Logout successful',
    };
  }
}
