import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
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
  // console.log("Log4jsLogger==========",Log4jsLogger)
  app.useLogger(app.get(Log4jsLogger));

  await app.listen(3000);
}
bootstrap();
