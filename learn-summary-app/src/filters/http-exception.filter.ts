/*
异常过滤器
虽然基本（内置）异常过滤器可以为您自动处理许多情况，但有时您可能希望对异常层拥有完全控制权，例如，您可能要添加日志记录或基于一些动态因素使用其他 JSON模式。
异常过滤器正是为此目的而设计的。 它们使您可以控制精确的控制流以及将响应的内容发送回客户端。 */

/*
让我们创建一个异常过滤器，它负责捕获作为HttpException类实例的异常，并为它们设置自定义响应逻辑。为此，我们需要访问底层平台 Request和 Response。
我们将访问Request对象，以便提取原始 url并将其包含在日志信息中。我们将使用 Response.json()方法，使用 Response对象直接控制发送的响应。 */

/*
让我们看一下该 catch() 方法的参数。该 exception 参数是当前正在处理的异常对象。该host参数是一个 ArgumentsHost 对象。 ArgumentsHost 是一个功能强大的实用程序对象，我们将在执行上下文章节 *中进一步进行研究。
在此代码示例中，我们使用它来获取对 Request 和 Response 对象的引用，这些对象被传递给原始请求处理程序（在异常发生的控制器中）。
在此代码示例中，我们使用了一些辅助方法 ArgumentsHost 来获取所需的 Request 和 Response 对象。ArgumentsHost 在此处了解更多信息。
之所以如此抽象，是因为它 ArgumentsHost 可以在所有上下文中使用（例如，我们现在正在使用的 HTTP 服务器上下文，以及微服务和 WebSocket ）。
在执行上下文章中，我们会看到我们如何可以访问相应的基础参数进行任何与动力执行上下文 ArgumentsHost 和它的辅助功能。这将使我们能够编写可在所有上下文中运行的通用异常过滤器。 */

import { ExceptionFilter, Catch, ArgumentsHost, HttpException, UseGuards } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request, Response } from 'express';
import { RolesGuard } from 'src/guards/roles.guard';
/*
所有异常过滤器都应该实现通用的 ExceptionFilter<T> 接口。它需要你使用有效签名提供 catch(exception: T, host: ArgumentsHost)方法。T 表示异常的类型。 */
@Catch(HttpException)
@UseGuards(new RolesGuard(new Reflector))
export class HttpExceptionFilter implements ExceptionFilter {
/*
@Catch() 装饰器绑定所需的元数据到异常过滤器上。它告诉 Nest这个特定的过滤器正在寻找 HttpException 而不是其他的。
在实践中，@Catch() 可以传递多个参数，所以你可以通过逗号分隔来为多个类型的异常设置过滤器。
 */
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
  }
}