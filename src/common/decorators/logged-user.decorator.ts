import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { Users } from '@/entities/users.entity';

export const LoggedUser = createParamDecorator(
  (data: keyof Users, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    return data ? user && user[data] : user;
  },
);
