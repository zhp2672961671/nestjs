// import { Module } from '@nestjs/common';
import { Module, CacheModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { ProjModule } from './mpgame/proj.module';
import * as path from 'path';
// https://nestjs-i18n.com/
import {
  AcceptLanguageResolver,
  I18nModule,
  HeaderResolver,
} from 'nestjs-i18n';
@Module({

  imports: [
    // Log4jsModule.forRoot(),
    CacheModule.register({    // 导入缓存模块
      isGlobal: true,
      ttl: 0,
    }),
    // .forRoot()调用初始化调度器并且注册在你应用中任何声明的cron jobs,timeouts和intervals。
    ScheduleModule.forRoot(), // 导入计划模块
    ConfigModule.forRoot({     //导入配置模块
      envFilePath: 'envs/.env.sample',
      // envFilePath: ['.env.development.local', '.env.development'],
    }),
    // ConfigModule.forRoot(),
    ProjModule,
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        //process.cwd() 用于获取node.js流程的当前工作目录。
        path: path.join(process.cwd(), '/data/i18n/'),
        watch: true,
      },
      // 解析器
      resolvers: [
        { use: HeaderResolver, options: ['lang', 'l'] },
        AcceptLanguageResolver,
      ],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}