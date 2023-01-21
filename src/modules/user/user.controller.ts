import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Head,
  HttpStatus,
  InternalServerErrorException,
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

import { Users } from '@/entities/users.entity';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import EmailTakenException from './exceptions/email-taken.exception';
import UserNotFoundException from './exceptions/user-not-found.exception';
import UsernameTakenException from './exceptions/username-taken.exception';
import { UserService } from './user.service';

@Controller({
  path: 'users',
  version: '1',
})
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
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
  @ApiOperation({ operationId: 'Get User by id' })
  @ApiOkResponse({ description: 'Return user data', type: Users })
  @ApiNotFoundResponse({ description: 'User not found' })
  async getUserById(@Param('id') id: string) {
    const user = await this.userService.findOne({ id });

    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }

  @Post()
  @ApiOperation({ operationId: 'Create User' })
  @ApiOkResponse({
    description: 'Return created user data',
    type: Users,
  })
  @ApiConflictResponse({
    description: 'Username or email already taken',
  })
  async createUser(@Body() data: CreateUserDto) {
    const result = await this.userService.create(data);

    if (result.isErr()) {
      const error = result._unsafeUnwrapErr();

      if (error.name === 'EXISTS') {
        switch (error.message) {
          case 'username':
            throw new UsernameTakenException();
          case 'email':
            throw new EmailTakenException();
          default:
            throw new BadRequestException({ message: error.message });
        }
      }

      throw new InternalServerErrorException({ message: error.message });
    }

    return result._unsafeUnwrap();
  }

  @Put(':id')
  @ApiOperation({ operationId: 'Update User by id' })
  @ApiOkResponse({ description: 'Return updated user data', type: Users })
  @ApiConflictResponse({
    description: 'Username or email already taken',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  async updateUserById(@Param('id') id: string, @Body() data: UpdateUserDto) {
    const result = await this.userService.update(id, data);

    if (result.isErr()) {
      const error = result._unsafeUnwrapErr();

      if (error.name === 'EXISTS') {
        switch (error.message) {
          case 'username':
            throw new UsernameTakenException();
          case 'email':
            throw new EmailTakenException();
          default:
            throw new BadRequestException({ message: error.message });
        }
      } else if (error.name === 'NOT_FOUND') {
        throw new UserNotFoundException();
      }

      throw new InternalServerErrorException({ message: error.message });
    }

    return result._unsafeUnwrap();
  }

  @Delete(':id')
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
      const error = result._unsafeUnwrapErr();

      if (error.name === 'NOT_FOUND') {
        throw new UserNotFoundException();
      }

      throw new InternalServerErrorException({ message: error.message });
    }

    res.sendStatus(HttpStatus.NO_CONTENT);
  }

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
      throw new UsernameTakenException();
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
      throw new EmailTakenException();
    }

    res.sendStatus(HttpStatus.OK);
  }
}
