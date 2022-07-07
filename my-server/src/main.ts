import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
// OpenAPI是一个与语言无关的RESTful API定义说明，Nest提供了一个专有的模块来利用装饰器生成类似声明。
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import express from 'express';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filter/any-exception.filter';
import { HttpExceptionFilter } from './filter/http-exception.filter';
import { TransformInterceptor } from './interceptor/transform.interceptor';
// import { Log4jsLogger } from './log4js';

import { logger } from './middleware/logger.middleware';
import { MyLogger } from './newLog4js/log4js';

// 引导方法
async function bootstrap() {
  // 创建app对象 自定义应用  使用Express平台
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // 禁用日志
    logger: new MyLogger(),
  });

  // 使用参数验证全局管道 自动保护所有接口免受不正确的数据的影响。
  app.useGlobalPipes(new ValidationPipe());

  // app.use(express.json()); // For parsing application/json
  // app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
  // 监听所有的请求路由，并打印日志
  // 使用全局拦截器打印出参
  app.useGlobalInterceptors(new TransformInterceptor());
  // 过滤处理 HTTP 异常
  app.useGlobalFilters(new HttpExceptionFilter());
   // 过滤处理所有异常
  app.useGlobalFilters(new AllExceptionsFilter());
  // 全局中间件
  app.use(logger);

  // 使用外部记录器log4js, 便于生产环境后台运行记录日志
  // app.useLogger(app.get(Log4jsLogger));
  // 开启跨域配置
  app.enableCors({
    origin: true,//true 设置为 req.origin.url
    credentials: true,//携带cookie跨域
    maxAge: 1728000,//options预验结果缓存时间 20天
  });
  // 文档配置
  const options = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API description')
    .setVersion('1.0')
    .build();
  // 通过SwaggerModule#createDocument()方法返回)是一个遵循OpenAPI文档的序列化对象
  // 有两个参数，一个应用实例和一个Swagger选项对象。
  const document = SwaggerModule.createDocument(app, options);

  // 指定文档路径
  /*
  挂载Swagger界面的路径。
  应用实例。
  上述实例化的文档对象。 */
  SwaggerModule.setup('api', app, document);


  await app.listen(3000);
}
bootstrap();
