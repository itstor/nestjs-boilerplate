import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { JwtAuthGuard } from '../guards/jwt.guard';

export const UseAuth = ({
  ignoreVerified = true,
}: {
  ignoreVerified?: boolean;
} = {}) => {
  return applyDecorators(
    UseGuards(JwtAuthGuard(ignoreVerified)),
    ApiBearerAuth('Access Token'),
    ApiUnauthorizedResponse({ description: 'User is not logged in' }),
  );
};
