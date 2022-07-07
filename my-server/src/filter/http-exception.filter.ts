// src/filter/http-exception.filter.ts
// 内置的异常层负责处理整个应用程序中的所有抛出的异常。当捕获到未处理的异常时，最终用户将收到友好的响应。
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { Logger } from '../newLog4js/log4js';
/*
HttpException 构造函数有两个必要的参数来决定响应:

response 参数定义 JSON 响应体。它可以是 string 或 object，如下所述。

status参数定义HTTP状态代码。

默认情况下，JSON 响应主体包含两个属性：

statusCode：默认为 status 参数中提供的 HTTP 状态代码

message:基于状态的 HTTP 错误的简短描述
*/
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    /*
    host.switchToHttp()帮助方法调用一个HTTP应用的HttpArgumentsHost对象. HttpArgumentsHost对象有两个有用的方法，我们可以用来提取期望的对象。我们也可以使用Express类型的断言来返回原生的Express类型对象：
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    \ */
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const logFormat = ` <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    Request original url: ${request.originalUrl}
    Method: ${request.method}
    IP: ${request.ip}
    Status code: ${status}
    Response: ${exception.toString()} \n  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    `;
    Logger.info(logFormat);
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: exception.message,
      msg: `${status >= 500 ? 'Service Error' : 'Client Error'}`,
    });
  }
}
