import { Controller } from '@nestjs/common';

import { TokenService } from './token.service';
import { UserService } from '../user/user.service';

@Controller('token')
export class TokenController {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}
}
