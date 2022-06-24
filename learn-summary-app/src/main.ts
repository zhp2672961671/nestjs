import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { RolesGuard } from './guards/roles.guard';
import { ValidationPipe } from './pipes/validate.pipe';
import { Reflector } from '@nestjs/core';
import { LoggingInterceptor } from './Interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 创建一个全局范围的过滤器
  // 该 useGlobalFilters() 方法不会为网关和混合应用程序设置过滤器。
  app.useGlobalFilters(new HttpExceptionFilter());
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  // 设置为一个全局作用域的管道，用于整个应用程序中的每个路由处理器。
  // 在 混合应用中 useGlobalPipes() 方法不会为网关和微服务设置管道, 对于标准(非混合) 微服务应用使用 useGlobalPipes() 全局设置管道。
  app.useGlobalPipes(new ValidationPipe());
  /*
  设置一个全局守卫
  全局守卫用于整个应用程序, 每个控制器和每个路由处理程序。在依赖注入方面, 从任何模块外部注册的全局守卫 (如上面的示例中所示) 不能插入依赖项,
   因为它们不属于任何模块。
  */
  app.useGlobalGuards(new RolesGuard(new Reflector));

  /*
  从模块外部注册的全局拦截器
  无法插入依赖项, 因为它们不属于任何模块。
  */
  app.useGlobalInterceptors(new LoggingInterceptor());

  await app.listen(3000);
}
bootstrap();

