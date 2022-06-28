import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Log4jsLogger } from './log4js';

// 引导方法
async function bootstrap() {
  // 创建app对象 自定义应用  使用Express平台
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // 禁用日志
    logger: false,
  });

  // 使用参数验证全局管道 自动保护所有接口免受不正确的数据的影响。
  app.useGlobalPipes(new ValidationPipe());

  // 使用外部记录器log4js, 便于生产环境后台运行记录日志
  app.useLogger(app.get(Log4jsLogger));
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
