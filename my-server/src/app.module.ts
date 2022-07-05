// import { Module } from '@nestjs/common';
import { Module, CacheModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { ProjModule } from './mpgame/proj.module';

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
      envFilePath: '.env.sample',
    }),
    ProjModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}