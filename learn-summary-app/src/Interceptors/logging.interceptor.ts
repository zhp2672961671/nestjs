/*
使用拦截器在函数执行之前或之后添加额外的逻辑。
*/
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
@Injectable()
/*
NestInterceptor<T，R> 是一个通用接口，其中 T 表示已处理的 Observable<T> 的类型（在流后面），
而 R 表示包含在返回的 Observable<R> 中的值的返回类型。
*/
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');
    const now = Date.now();
    return next
    // handle() 返回一个RxJS Observable，我们有很多种操作符可以用来操作流。
      .handle()
      .pipe(
        // tap() 运算符，该运算符在可观察序列的正常或异常终止时调用函数。
        tap(() => console.log(`After... ${Date.now() - now}ms`)),
      );
  }
}