import { Injectable, LoggerService } from '@nestjs/common';
import { Logger } from 'log4js';

//自定义中间件
@Injectable()
export class Log4jsLogger implements LoggerService {
  constructor(private readonly logger: Logger) { }

  updateContext(context?: string) {
    if (context && context.length > 0) {
      // 这存储了一个键值对，该对已添加到Logger生成的所有日志事件中。用途是添加ID以通过您的应用程序跟踪用户
      this.logger.addContext('name', context);
    } else {
      this.logger.addContext('name', '');
    }
  }

  verbose(message: any, context?: string) {
    this.updateContext(context);
    this.logger.trace(message);
  }

  debug(message: any, context?: string) {
    this.updateContext(context);
    this.logger.debug(message);
  }

  log(message: any, context?: string) {
    this.updateContext(context);
    this.logger.info(message);
  }

  warn(message: any, context?: string) {
    this.updateContext(context);
    this.logger.warn(message);
  }

  error(message: any, trace?: string, context?: string) {
    this.updateContext(context);
    this.logger.error(message, trace);
  }

  static getTimestamp() {
    const localeStringOptions = {
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      day: '2-digit',
      month: '2-digit',
    } as const;
    // Date.now() 方法返回自 1970 年 1 月 1 日 00:00:00 (UTC) 到当前时间的毫秒数。
    /* 
     // toLocale​String()用来返回格式化对象后字符串
    这个方法有两个参数: locale和options。
    locale为可选参数，它用来指定格式化对象时使用的语言环境。默认是浏览器当前的语言环境。该参数的可选值可以参考这里。
    options也是一个可选参数，它是对象格式，用来设置对象格式化样式的一些配置属性。
    */
    return new Date(Date.now()).toLocaleString(undefined, localeStringOptions);
  }

  getTimestamp() {
    return Log4jsLogger.getTimestamp();
  }
}
