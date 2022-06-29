import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbLogger } from 'src/newLog4js/log4js';
@Module({
    imports: [
      TypeOrmModule.forRootAsync({
        // 异步加载，此时配置器完成注入
        useFactory: () => ({
          type: 'mysql', // 数据库类型
          entities: [    // 数据表实体 扫描项目路劲中.entity文件
            "dist/blockchain/**/*.entity{.ts,.js}",
            "dist/mpgame/**/*.entity{.ts,.js}"
          ],
          host: process.env.DB_HOST || 'localhost', // 主机，默认为localhost
          port: Number(process.env.DB_PORT) || 3306, // 端口号
          username: process.env.DB_USER || 'root',   // 用户名
          password: process.env.DB_PASS || 'root', // 密码
          database: process.env.DB_NAME || 'test', //数据库名
          timezone: '+08:00', //服务器上配置的时区
          synchronize: true, //根据实体自动创建数据库表， 生产环境建议关闭
          "logger": new DbLogger(),	// 配置项添加自定义的log类
          logging: true,
        }),
        // useFactory: () => ({
        //   type: 'mysql', // 数据库类型
        //   entities: [    // 数据表实体 扫描项目路劲中.entity文件
        //     // "dist/blockchain/**/*.entity{.ts,.js}",
        //     // "dist/mpgame/**/*.entity{.ts,.js}"
        //   ],
        //   host:'localhost', // 主机，默认为localhost
        //   port:  3306, // 端口号
        //   username: 'root',   // 用户名
        //   password: 'root', // 密码
        //   database:'test', //数据库名
        //   timezone: '+08:00', //服务器上配置的时区
        //   synchronize: true, //根据实体自动创建数据库表， 生产环境建议关闭
        // }),
      }),
    ],
  })
// @Module({
//   imports: [
//     TypeOrmModule.forRoot({
//       type: 'mysql',
//       host: 'localhost',
//       port: 3306,
//       username: 'root',
//       password: 'root',
//       database: 'test',
//       entities: [],
//       synchronize: true,
//     }),
//   ],
// })
export class ProjModule {}