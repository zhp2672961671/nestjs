import { Module, NestModule, RequestMethod, MiddlewareConsumer } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { CatsModule } from './cats/cats.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { ValidationPipe } from './pipes/validate.pipe';

@Module({
  imports: [CatsModule],

  providers: [
    {
      provide: APP_FILTER,
      /* 
     全局过滤器用于整个应用程序、每个控制器和每个路由处理程序。就依赖注入而言， 
    从任何模块外部注册的全局过滤器（使用上面示例中的 useGlobalFilters()）不能注入依赖，因为它们不属于任何模块。
    为了解决这个问题，你可以注册一个全局范围的过滤器直接为任何模块设置过滤器： */
      useClass: HttpExceptionFilter,
      
      /* 
      全局管道用于整个应用程序、每个控制器和每个路由处理程序。就依赖注入而言，
      从任何模块外部注册的全局管道（如上例所示）无法注入依赖，因为它们不属于任何模块。为了解决这个问题，可以使用以下构造直接为任何模块设置管道： */
      // 使用 ValidationPipe 定义管道 另外，useClass 并不是处理自定义提供者注册的唯一方法。
      // useClass: ValidationPipe
    },
  ],
})
// 中间件不能在 @Module() 装饰器中列出。我们必须使用模块类的 configure() 方法来设置它们。
// 包含中间件的模块必须实现 NestModule 接口。我们将 LoggerMiddleware 设置在 ApplicationModule 层上
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      // 该 apply() 方法可以使用单个中间件，也可以使用多个参数来指定多个多个中间件。
      .apply(LoggerMiddleware)
      // 如前所述，为了绑定顺序执行的多个中间件，我们可以在 apply() 方法内用逗号分隔它们。
      // consumer.apply(cors(), helmet(), logger).forRoutes(CatsController);
      // .forRoutes('cats');



      // 我们为之前在CatsController中定义的/cats路由处理程序设置了LoggerMiddleware。
      // 我们还可以在配置中间件时将包含路由路径的对象和请求方法传递给 forRoutes()方法，从而进一步将中间件限制为特定的请求方法。
      // 在下面的示例中，请注意我们导入了 RequestMethod来引用所需的请求方法类型。
      .forRoutes({ path: 'cats', method: RequestMethod.GET });
  }
}
/* 
MiddlewareConsumer 是一个帮助类。它提供了几种内置方法来管理中间件。
他们都可以被简单地链接起来。forRoutes() 可接受一个字符串、多个字符串、对象、一个控制器类甚至多个控制器类。
在大多数情况下，您可能只会传递一个由逗号分隔的控制器列表。以下是单个控制器的示例：
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { CatsModule } from './cats/cats.module';
import { CatsController } from './cats/cats.controller.ts';
@Module({
  imports: [CatsModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(CatsController);
  }
}
 */

/* 
有时我们想从应用中间件中排除某些路由。我们可以使用该 exclude() 方法轻松排除某些路由。此方法可以采用一个字符串，
多个字符串或一个 RouteInfo 对象来标识要排除的路由，如下所示：
consumer
  .apply(LoggerMiddleware)
  .exclude(
    { path: 'cats', method: RequestMethod.GET },
    { path: 'cats', method: RequestMethod.POST },
    'cats/(.*)',
  )
  .forRoutes(CatsController);
 */


