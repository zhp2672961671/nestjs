import { Injectable, NestMiddleware } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Request, Response, NextFunction } from 'express';
import { AppModule } from 'src/app.module';
// 可以在函数中或在具有 @Injectable() 装饰器的类中实现自定义 Nest中间件
// 依赖注入
// Nest中间件完全支持依赖注入。 就像提供者和控制器一样，它们能够注入属于同一模块的依赖项（通过 constructor ）。

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request...');
    next();
  }
}

// 这种类型的中间件称为函数式中间件。让我们把 logger 转换成函数。
export function logger(req, res, next) {
    console.log(`Request...`);
    next();
  };
//   如果我们想一次性将中间件绑定到每个注册路由，我们可以使用由INestApplication实例提供的 use()方法：
// const app = await NestFactory.create(AppModule);
// app.use(logger);
// await app.listen(3000);