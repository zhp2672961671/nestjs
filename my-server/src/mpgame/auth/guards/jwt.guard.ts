import { Injectable, ExecutionContext, SetMetadata } from '@nestjs/common';
// passport 是目前最流行的 node.js 认证库，
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

// 导出自定义角色装饰器
// @SetMetadata() 装饰器将定制元数据附加到路由处理程序的能力。这些元数据提供了我们所缺少的角色数据，而守卫需要这些数据来做出决策。
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@Injectable()
export class JwtRolesGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    console.log("Reflector===========Reflector")
    super();
  }

  async canActivate(context: ExecutionContext): Promise<any>{
    console.log("canActivate===========1",context)
    // 执行认证守卫的验证方法
    // 异步成功后获得req.user属性
    if(await super.canActivate(context)) {
      console.log("canActivate===========2",)
      const user = context.switchToHttp().getRequest().user;
      console.log("user===========",user,  context.getHandler(),  context.getClass())

      // 获取路由所需的权限属性
      const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
        context.getHandler(),
        context.getClass(),
      ]);

      // 无需权限
      if(!requiredRoles) {
        return true;
      }

      // 返回一个权限包含关系的boolean结果
      return requiredRoles.some((role) => user.roles?.includes(role));

    }
    console.log("canActivate===========3",)

    // 过不了认证
    return false;
  }
}