import { Configuration } from 'log4js';
/* 
symbol
基本数据类型，可以创建第一无二的值
可以传递参做为唯一标识 只支持 string 和 number类型的参数
 */
export const LOG4JS_OPTIONS = Symbol('NEST_LOG4JS_OPTIONS');
export const LOG4JS_LOGGER = Symbol('NEST_LOG4JS_LOGGER');
// layout 用于定义每条日志的输出格式
export const LOG4JS_DEFAULT_LAYOUT = {
  type: 'pattern',//按照指定的模式进行输出
  // log4js default pattern %d{yyyy-MM-dd HH:mm:ss:SSS} [%thread] %-5level %logger{36} - %msg%n
  // we use process id instead thread id

  /* 
  %d{HH:mm:ss.SSS} 表示输出到毫秒的时间
  %-5p的意思是日志级别输出左对齐，右边以空格填充
   */
  pattern:
    '%[%d{yyyy-MM-dd hh:mm:ss:SSS} %-5.5p --- [%15.15x{name}]%] %40.40f{3}  : %m',
  tokens: {
    name: (logEvent) => {
      return (logEvent.context && logEvent.context['name']) || '-';
    },
  },
};

export const LOG4JS_NO_COLOUR_DEFAULT_LAYOUT = {
  type: 'pattern',
  // log4js default pattern %d{yyyy-MM-dd HH:mm:ss:SSS} [%thread] %-5level %logger{36} - %msg%n
  // we use process id instead thread id
  pattern:
    '%d{yyyy-MM-dd hh:mm:ss:SSS} %-5.5p --- [%15.15x{name}] %40.40f{3}  : %m',
  tokens: {
    name: (logEvent) => {
      return (logEvent.context && logEvent.context['name']) || '-';
    },
  },
};

export const LOG4JS_DEFAULT_CONFIG: Configuration = {
  // 一个命名的追加器（string）到追加器的定义对象，对象必须有type（string）属性。
  appenders: {
    // 标准输出附加器
    // 此附加程序将所有日志事件写入标准输出流
    stdout: {
      type: 'stdout',
      layout: LOG4JS_DEFAULT_LAYOUT,
    },
    /* 
    file——输出至指定文件
    属性	类型	含义
filename	string	日志保存文件的路径及文件名，./为项目根目录
maxLogSize?	number / string	日志文件的最大大小(以字节为单位),如果未指定，则不会发生日志滚动
backups?	number	日志滚动期间要保留的旧日志文件数，默认值为5
compress?	boolean	是否压缩backups
encoding?	string	编码格式，默认为utf-8
layout?	Layout	输出的样式
 */
    file: {
      type: 'file',
      filename: './logs/application.log',
      maxLogSize: 20 * 1024 * 1024, // maxLogSize use bytes ad unit
      backups: 10, // default use 5 so 1KB file size total rotating
      layout: LOG4JS_NO_COLOUR_DEFAULT_LAYOUT,
    },
  },
  // 一个命名的类别（string）到类别定义对象。必须定义默认类别，用于不匹配特定类别的所有日志事件。必须有两个属性appenders、level
  // 配置了 default 日志器 引用了 stdout 和 file 两个 appender
  categories: {
    default: {
      // 将其设置为`true`将使此类别的日志事件使用呼叫堆栈在事件中生成行号和文件名。
      enableCallStack: true,
      appenders: ['stdout', 'file'],
      level: 'debug',
    },
  },
};
