import { DynamicModule, Global, Module } from '@nestjs/common';
import {
  DEFAULT_LOG4JS_OPTIONS,
  getLog4jsLoggerToken,
  getLog4jsOptionsToken,
  Log4jsAsyncOptions,
  Log4jsOptions,
} from './log4js.options';
import {
  createAsyncLog4jsOptions,
  createLog4jsLogger,
} from './log4js.providers';
import { Log4jsLogger } from './log4js.classes';

@Global()
@Module({})
export class Log4jsModule {
  // forRoot() 可以同步或异步（Promise）返回动态模块。
  static forRoot(
    options: Log4jsOptions = DEFAULT_LOG4JS_OPTIONS,
  ): DynamicModule {
    return {
      module: Log4jsModule,
      providers: [
        {
          provide: getLog4jsOptionsToken(options.name),
          // 值提供者
          useValue: options,
        },
        createLog4jsLogger(options.name),
        {
          // 别名提供者
          // useExisting 语法允许您为现有的提供程序创建别名。这将创建两种访问同一提供者的方法
          provide: Log4jsLogger,
          useExisting: getLog4jsLoggerToken(options.name),
        },
      ],
      exports: [
        getLog4jsLoggerToken(options.name),
        {
          provide: Log4jsLogger,
          useExisting: getLog4jsLoggerToken(options.name),
        },
      ],
    };
  }
// 异步传递模块选项
  static forRootAsync(options: Log4jsAsyncOptions): DynamicModule {
    return {
      module: Log4jsModule,
      imports: options.imports,
      providers: [
        createAsyncLog4jsOptions(options),
        createLog4jsLogger(options.name),
        {
          provide: Log4jsLogger,
          useExisting: getLog4jsLoggerToken(options.name),
        },
      ],
      exports: [
        getLog4jsLoggerToken(options.name),
        {
          provide: Log4jsLogger,
          useExisting: getLog4jsLoggerToken(options.name),
        },
      ],
    };
  }
}
