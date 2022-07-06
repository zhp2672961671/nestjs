import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as JobEntity from "./job.entity";
import { JobService } from './job.service';
// import { JobSchedule } from './job.schedule';
import { EventMpJob } from './schedule/job.event.mp';
import { EventMintJob } from './schedule/job.event.mint';
import { HandleMintJob } from './schedule/job.handle.mint';

@Module({
    // forFeature() 方法定义在当前范围中注册哪些存储库，直接建表
  imports: [TypeOrmModule.forFeature([
    JobEntity.MintEvent,
    JobEntity.MpEvent,
    JobEntity.Order,
    JobEntity.Passport,
  ])],
  providers: [
    JobService,
    // JobSchedule,
    EventMpJob,
    EventMintJob,
    HandleMintJob,
  ],
  exports: [JobService]
})
export class JobModule {}
