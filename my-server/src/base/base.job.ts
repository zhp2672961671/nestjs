/*
Nest 提供了@nestjs/bull包，这是Bull包的一个包装器，Bull 是一个流行的、支持良好的、
高性能的基于 Nodejs 的消息队列系统应用。该包将 Bull 队列以 Nest 友好的方式添加到你的应用中。 */
import { OnQueueActive, OnQueueError, OnQueueFailed, OnQueueWaiting, OnQueueCompleted, OnQueueStalled } from "@nestjs/bull";
// import { Logger } from "src/log4js";
import { Job, Queue } from "bull";
import { Logger } from "src/newLog4js/log4js";

// 简易版任务父类不含队列
export class BaseJobSimple {
  // 逻辑执行成功，返回标准成功结果
  success(data:object = {}, msg:string = 'success'):object {
    const success = true;
    return { success, data, msg };
  }

  // 执行逻辑失败，不包含data
  fail(msg:string = 'failed'):object {
    const success = false;
    const data = {};
    return { success, data, msg };
  }

  // 执行逻辑成功，包含data
  failData(data:object = {}, msg:string = 'failed'):object {
    const success = false;
    return { success, data, msg };
  }
}

// 标准版任务基类含任务
export class BaseJob {
  constructor(
    protected readonly queueName: string,
    protected readonly jobName: string,
    protected readonly queue: Queue<any>,
  ) {}

  // 逻辑执行成功，返回标准成功结果
  success(data:object = {}, msg:string = 'success'):object {
    const success = true;
    return { success, data, msg };
  }

  // 执行逻辑失败，不包含data
  fail(msg:string = 'failed'):object {
    const success = false;
    const data = {};
    return { success, data, msg };
  }

  // 执行逻辑成功，包含data
  failData(data:object = {}, msg:string = 'failed'):object {
    const success = false;
    return { success, data, msg };
  }

  // 查看jobs
  async showJobs() {
    console.log('----------------------------------------');
    //getJobs 返回一个 promise，它将返回给定类型的作业实例数组。提供了范围和排序的可选参数。
    // map() 方法创建一个新数组，其结果是该数组中的每个元素是调用一次提供的函数后的返回值。
    console.log(
      'completedJobs',
      (await this.queue.getJobs(['completed'])).map(job => job.id),
    );
    console.log(
      'waiting',
      (await this.queue.getJobs(['waiting'])).map(job => job.id),
    );
    console.log(
      'failedJobs',
      (await this.queue.getJobs(['failed'])).map(job => job.id),
    );
  }

  // 清理jobs
  async cleanJobs () {
    // 已完成
    // remove 从队列和可能包含的任何列表中删除作业。
    (await this.queue.getJobs(['completed'])).map(
      async job => await job.remove(),
    );
    // 失败
    (await this.queue.getJobs(['failed'])).map(
      async job => await job.remove(),
    );
  }

  // 任务激活监听
  @OnQueueActive()
  async onQueueActive(job: Job) {
    Logger.debug(`[${this.queueName}][Queue.event => 'active'][job#${job.id}]`, this.jobName || BaseJob.name);
  }

  // 队列异常事件监听
  @OnQueueError()
  async onQueueError(error: Error) {
   Logger.error(`[${this.queueName}][Queue.event => 'error'] error: ${error}`, '', this.jobName || BaseJob.name);
  }

  // 队列任务失败事件监听
  @OnQueueFailed()
  async onQueueFailed(job: Job, error: Error) {
   Logger.error(`[${this.queueName}][Queue.event => 'failed'][job#${job.id}][data:${JSON.stringify(job.data || {})}] error: ${error}`, '', this.jobName || BaseJob.name);
  }

  // 队列任务等待事件监听
  @OnQueueWaiting()
  async onQueueWaiting(jobId: number | string) {
    //Logger.debug(`[${this.queueName}][Queue.event => 'waiting'][job#${jobId}]`, this.jobName || BaseJob.name);
  }

  // 队列任务完工事件监听
  @OnQueueCompleted()
  async onQueueCompleted(job: Job, result: any) {
   Logger.debug(`[${this.queueName}][Queue.event => 'completed'][job#${job.id}][data:${JSON.stringify(job.data || {})}] result: ${result}`, this.jobName || BaseJob.name);
    // 完成的任务从redis库中删除
    await job.remove();
  }

  // 队列任务搁置事件监听
  @OnQueueStalled()
  async onQueueStalled(job: Job) {
    //Logger.debug(`[${this.queueName}][Queue.event => 'stalled'][job#${job.id}]`, this.jobName || BaseJob.name);
  }
}