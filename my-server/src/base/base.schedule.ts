// 缓存是一项伟大而简单的技术，可以帮助提高应用程序的性能。它充当临时数据存储，提供高性能的数据访问。
import { Cache } from "cache-manager";
import { Logger } from "src/newLog4js/log4js";

export class BaseSchedule {
  constructor(
    // protected readonly logger: Logger,
    protected readonly cache: Cache,
  ) {}

  async doTask(label: string, maxSkipSec: number, redisKey: string, taskFunc: Function): Promise<void> {
    // 从缓存获取上一个时间戳
    // get方法被用来从缓存中检索键值。如果该键在缓存中不存在，则返回null。
    const last = await this.cache.get<number>(redisKey);

    // 记录当前时间戳，以整数秒为单位
    const current = parseInt((Date.now() / 1000).toString());

    // 过滤掉没到超时限制的
    if(last && current - last < maxSkipSec) return;

    if(last && current - last >= maxSkipSec) {
      this.log(`[WAIT_TIMEOUT][FORCE_EXEC]`, label);
    }

    // this.log(`run(${maxSkipSec})`, label);
    // 异步执行任务体
    // 执行完成缓存删除key视为任务结束
    try {
      // set方法将一个键值对添加到缓存中:
      await this.cache.set(redisKey, current, { ttl: maxSkipSec + 1 });
      await taskFunc();
    } catch(err) {
      this.error(`[ERROR] ${err.message}`, label);
      throw err;
    } finally {
      // del方法从缓存中删除一个键值对:
      await this.cache.del(redisKey);
    }
  }

  log(msg: string, label?: string): void {
    Logger.debug(`schedule <${label}> ${msg}`, label || BaseSchedule.name);
  }

  error(msg: string, label?: string): void {
    Logger.error(`schedule <${label}> ${msg}`, '', label || BaseSchedule.name);
  }
}