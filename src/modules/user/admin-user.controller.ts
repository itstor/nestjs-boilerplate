import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { Paginate, PaginateQuery } from 'nestjs-paginate';

import { ApiErrorMessage } from '@/common/constants/api-error-message.constant';
import { UseAuth } from '@/common/decorators/use-auth.decorator';
import APIError from '@/common/exceptions/api-error.exception';
import { User } from '@/entities/user.entity';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller({
  path: 'admin/users',
  version: '1',
})
@ApiTags('Admin/Users')
export class AdminUserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseAuth()
  @ApiOperation({
    operationId: 'Get All Users',
    description: 'Get all users using offset pagination',
  })
  @ApiOkResponse({
    description: 'Return list of users data',
  })
  async getAllUsers(@Paginate() query: PaginateQuery) {
    return await this.userService.findMany(query);
  }

  @Get(':id')
  @UseAuth()
  @ApiOperation({ operationId: 'Get User by id' })
  @ApiOkResponse({ description: 'Return user data', type: User })
  @ApiNotFoundResponse({ description: 'User not found' })
  async getUserById(@Param('id') id: string) {
    const user = await this.userService.findOne({ id });

    if (!user) {
      throw APIError.fromMessage(ApiErrorMessage.USER_NOT_FOUND);
    }

    return user;
  }

  @Post()
  @UseAuth()
  @ApiOperation({ operationId: 'Create User' })
  @ApiOkResponse({
    description: 'Return created user data',
    type: User,
  })
  @ApiConflictResponse({
    description: 'Username or email already taken',
  })
  async createUser(@Body() data: CreateUserDto) {
    const result = await this.userService.create(data);

    if (result.isErr()) {
      const error = result.error;

      if (error.name === 'EXISTS') {
        switch (error.message) {
          case 'username':
            throw APIError.fromMessage(ApiErrorMessage.USERNAME_EXISTS);
          case 'email':
            throw APIError.fromMessage(ApiErrorMessage.USER_EMAIL_REGISTERED);
        }
      }

      throw APIError.fromMessage(
        ApiErrorMessage.INTERNAL_SERVER_ERROR,
        error.cause,
      );
    }

    return result.value;
  }

  @Put(':id')
  @UseAuth()
  @ApiOperation({ operationId: 'Update User by id' })
  @ApiOkResponse({ description: 'Return updated user data', type: User })
  @ApiConflictResponse({
    description: 'Username or email already taken',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  async updateUserById(@Param('id') id: string, @Body() data: UpdateUserDto) {
    const result = await this.userService.update(id, data);

    if (result.isErr()) {
      const error = result.error;

      if (error.name === 'EXISTS') {
        switch (error.message) {
          case 'username':
            throw APIError.fromMessage(ApiErrorMessage.USERNAME_EXISTS);
          case 'email':
            throw APIError.fromMessage(ApiErrorMessage.USER_EMAIL_REGISTERED);
        }
      } else if (error.name === 'NOT_FOUND') {
        throw APIError.fromMessage(ApiErrorMessage.USER_NOT_FOUND);
      }

      throw APIError.fromMessage(
        ApiErrorMessage.INTERNAL_SERVER_ERROR,
        error.cause,
      );
    }

    return result.value;
  }

  @Delete(':id')
  @UseAuth()
  @ApiOperation({ operationId: 'Delete User by id' })
  @ApiNoContentResponse({
    description: 'No content',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  async deleteUserById(@Param('id') id: string, @Res() res: Response) {
    const result = await this.userService.delete({ id });

    if (result.isErr()) {
      const error = result.error;

      if (error.name === 'NOT_FOUND') {
        throw APIError.fromMessage(ApiErrorMessage.USER_NOT_FOUND);
      }

      throw APIError.fromMessage(
        ApiErrorMessage.INTERNAL_SERVER_ERROR,
        error.cause,
      );
    }

    res.sendStatus(HttpStatus.NO_CONTENT);
  }
}
