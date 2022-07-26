import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EthModule } from 'src/blockchain/eth/eth.module';
import { DbLogger } from 'src/newLog4js/log4js';
import { AssetsModule } from './assets/assets.module';
import { AuthModule } from './auth/auth.module';
import { BuildModule } from './build/build.module';
import { GeoModule } from './geo/geo.module';
import { JobModule } from './job/job.module';
import { ParseModule } from './parse/parse.module';
import { UsersModule } from './users/users.module';
// console.log("process.env===========",process.env)
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
          password: process.env.DB_PASS || '123456', // 密码
          database: process.env.DB_NAME || 'test', //数据库名
          timezone: '+08:00', //服务器上配置的时区
          synchronize: true, //根据实体自动创建数据库表， 生产环境建议关闭
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
      EthModule,
      UsersModule,
      AuthModule,
      GeoModule,
      JobModule,
      BuildModule,
      ParseModule,
      // TestModule,
      AssetsModule,
    ],
  })
export class ProjModule {}