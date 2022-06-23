import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
// 为了将异常处理委托给基础过滤器，需要继承 BaseExceptionFilter 并调用继承的 catch() 方法。
@Catch()
// 继承自基础类的过滤器必须由框架本身实例化（不要使用 new 关键字手动创建实例）
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    super.catch(exception, host);
  }
}