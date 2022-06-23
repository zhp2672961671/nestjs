/*
基于角色认证
RolesGuard 。这个守卫只允许具有特定角色的用户访问。从一个基本模板开始
并在接下来的部分中构建它。目前，它允许所有请求继续:

根据分配给当前用户的角色与正在处理的当前路由所需的实际角色之间的比较来设置返回值的条件。
为了访问路由的角色(自定义元数据)，我们将使用在 @nestjs/core 中提供的 Reflector 帮助类。
 */

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
  canActivateOld(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return true;
  }
canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    // 将授权用户附加到 request 对象是一种常见的做法
    // 假设 request.user 包含用户实例和允许的角色。
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return matchRoles(roles, user.roles);
  }
}
// matchRoles() 函数内部的逻辑可以根据需要简单或复杂。该示例的重点是显示防护如何适应请求/响应周期。
function matchRoles(_roles: string[], roles: any): boolean {
    throw new Error('Function not implemented.');
}

