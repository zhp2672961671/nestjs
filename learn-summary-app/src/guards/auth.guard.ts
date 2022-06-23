/*
授权守卫
授权是保护的一个很好的用例，因为只有当调用者(通常是经过身份验证的特定用户)具有足够的权限时，
特定的路由才可用
*/
/*
AuthGuard 假设用户是经过身份验证的(因此，请求头附加了一个token)。
它将提取和验证token，并使用提取的信息来确定请求是否可以继续。
*/
import { Injectable, CanActivate, ExecutionContext, ArgumentsHost, Type } from '@nestjs/common';
import { Observable } from 'rxjs';
@Injectable()
export class AuthGuard implements CanActivate {
    /*
    每个守卫必须实现一个canActivate()函数。此函数应该返回一个布尔值，指示是否允许当前请求。
    它可以同步或异步地返回响应(通过 Promise 或 Observable)。
    Nest使用返回值来控制下一个行为:
如果返回 true, 将处理用户调用。
如果返回 false, 则 Nest 将忽略当前处理的请求。

    */
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return validateRequest(request);
  }
}
// 自动修复声明，无功能
// validateRequest() 函数中的逻辑可以根据需要变得简单或复杂。
function validateRequest(request: any): boolean | Promise<boolean> | Observable<boolean> {
    // 功能未实现。
    throw new Error('Function not implemented.');
}

// ExecutionContext 继承自 ArgumentsHost 。ArgumentsHost 是传递给原始处理程序的参数的包装器
export interface ExecutionContext1 extends ArgumentsHost {
    /*
    getClass()方法返回这个特定处理程序所属的 Controller 类的类型。
    getHandler()方法返回对将要调用的处理程序的引用。
    如果当前处理的请求是 POST 请求，目标是 CatsController上的 create() 方法，
    那么 getHandler() 将返回对 create() 方法的引用，
    而 getClass()将返回一个CatsControllertype(而不是实例)。
    */
    getClass<T = any>(): Type<T>;
    getHandler(): Function;
  }
