// src/interceptor/transform.interceptor.ts
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Logger } from '../newLog4js/log4js';
 /*
 拦截器是使用 @Injectable() 装饰器注解的类
  */
@Injectable()
/*
NestInterceptor<T，R> 是一个通用接口，其中 T 表示已处理的 Observable<T> 的类型（在流后面），而 R 表示包含在返回的 Observable<R> 中的值的返回类型。
*/
export class TransformInterceptor implements NestInterceptor {
  /*
  每个拦截器都有 intercept() 方法，它接收2个参数。 第一个是 ExecutionContext 实例（与守卫完全相同的对象）。 ExecutionContext 继承自 ArgumentsHost 。
   ArgumentsHost 是传递给原始处理程序的参数的一个包装 ，它根据应用程序的类型包含不同的参数数组
   ArgumentsHost简单地抽象为处理程序参数。例如，在HTTP应用中(使用@nestjs/platform-express时),host对象封装了Express的[request, response, next]数组,
  */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // getArgByIndex()根据索引获取指定参数:
    const req = context.getArgByIndex(1).req;
    return next.handle().pipe(
      map(data => {
        const logFormat = ` <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    Request original url: ${req.originalUrl}
    Method: ${req.method}
    IP: ${req.ip}
    User: ${JSON.stringify(req.user)}
    Response data:\n ${JSON.stringify(data.data)}
    <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<`;
        Logger.info(logFormat);
        Logger.access(logFormat);
        return data;
      }),
    );
  }
}
