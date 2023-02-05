import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { User } from '@/entities/user.entity';

export const LoggedUser = createParamDecorator(
  (data: keyof User, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    return data ? user && user[data] : user;
  },
);
