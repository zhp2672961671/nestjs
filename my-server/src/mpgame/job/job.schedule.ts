import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { BaseSchedule } from "src/base/base.schedule";
import { Cache } from "cache-manager";
import { EventMintJob } from "./schedule/job.event.mint";
import { EventMpJob } from "./schedule/job.event.mp";
import { HandleMintJob } from "./schedule/job.handle.mint";
import { JobConst, RedisKey } from "./job.config";

/**
 * 业务所用计划入口
 */
 @Injectable()
 export class JobSchedule extends BaseSchedule {
   constructor(
    // @Inject() 装饰器。属性的注入CACHE_MANAGER自定义标记的原因。
     @Inject(CACHE_MANAGER)
     protected readonly cache: Cache,
     private readonly eventMintJob: EventMintJob,
     private readonly handleMintJob: HandleMintJob,
     private readonly eventMpJob: EventMpJob,
   ) {
     super(cache);
   }
    // @Cron()装饰器支持标准的cron patterns:

    // 星号通配符 (也就是 *)
    // 范围（也就是 1-3,5)
    // 步长（也就是 */ 2
    // 在上述例子中，我们给装饰器传递了45 * * * * *，下列键展示了每个位置的计时模式字符串的意义：

    // * * * * * *
    // | | | | | |
    // | | | | | day of week
    // | | | | month
    // | | | day of month
    // | | hour
    // | minute
    // second (optional)
    // 一些示例的计时模式包括：

    // 名称	含义
    // * * * * * *	每秒
    // 45 * * * * *	每分钟第 45 秒
    // 10 * * *	每小时，从第 10 分钟开始
    // 0 /30 9-17 * *	上午 9 点到下午 5 点之间每 30 分钟
    // 0 30 11 * * 1-5	周一至周五上午 11:30

   /**
    * 同步订单创建的任务
    * 计划调用间隔3秒
    * 计划等待超时45秒
    */
   @Cron('*/3 * * * * *')
   async SyncEventMintOrderCreated(): Promise<void> {
     await this.doTask(JobConst.SYNC_EVENT_MINT, 45, RedisKey.scheduleSyncEventMint(), async () => {
       await this.eventMintJob.sync();
     });
   }

   /**
    * 同步Box事件的任务
    * 计划调用间隔3秒
    * 计划等待超时60秒
    */
   @Cron('*/3 * * * * *')
   async SyncBoxEvent(): Promise<void> {
     await this.doTask(JobConst.SYNC_HANDLE_MINT, 60, RedisKey.scheduleSyncHandleMint(), async () => {
       await this.handleMintJob.sync();
     });
   }

   /**
    * 同步护照被创建的数据
    * 计划调用间隔3秒
    * 计划等待超时45秒
    */
   @Cron('*/3 * * * * *')
   async SyncEventMetaPassportMint(): Promise<void> {
     await this.doTask(JobConst.SYNC_EVENT_MP, 45, RedisKey.scheduleSyncEventMp(), async () => {
       await this.eventMpJob.sync();
     });
   }
 }