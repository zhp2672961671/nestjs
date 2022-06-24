// 创建 @User() 装饰器并且在所有控制器中重复利用它。
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
/*
createParamDecorator<T>() 是通用的。这意味着您可以显式实施类型安全性，
例如 createParamDecorator<string>((data, ctx) => ...)或者，在工厂功能中指定参数类型，
例如createParamDecorator((data: string, ctx) => ...) 。如果省略这两个，该类型 data 会 any。
 */
export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    // 如果存在则返回关联的值（如果不存在或者尚未创建 user 对象，则返回undefined）。
    return data ? user && user[data] : user;
  },
);