import {
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { AuthenticatedUser } from './authenticated-user.interface.js';

export const CurrentUser = createParamDecorator(
  (
    _data: unknown,
    context: ExecutionContext,
  ): AuthenticatedUser => {
    const request = context.switchToHttp().getRequest();

    return request.user as AuthenticatedUser;
  },
);
