/*
响应映射

创建一个 TransformInterceptor, 它将打包响应并将其分配给 data 属性。
*/
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
export interface Response<T> {
  data: T;
}
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(map(data => ({ data })));
    // 将每个发生的 null 值转换为空字符串 ''
    return next
    .handle()
    .pipe(map(value => value === null ? '' : value ));
  }
}