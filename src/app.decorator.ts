import { createParamDecorator } from '@nestjs/common';

/**
 * 当前登录用户
 */
export const LoginUser = createParamDecorator((_, req) => {
  return req.user;
});
