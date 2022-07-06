import { Injectable } from "@nestjs/common";
import { BaseJobSimple } from "src/base/base.job";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MintEvent, Order } from "../job.entity";
import { EthService } from "src/blockchain/eth/eth.service";
import { ContractAddress, ContractEvents } from "src/blockchain/eth/eth.config";
import { EthContractMint } from "src/blockchain/eth/contract/eth.contract.mint";
import { ethers } from "ethers";
import { Logger } from "src/newLog4js/log4js";


/** 同步事件任务，每次区块范围 */
const SYNC_JOB_BLOCK_STEP = 99;

/** 同步事件任务，区块之间最少间隔，小于该间隔，任务取消 */
const SYNC_JOB_MIN_DRUATION = 1;

/**
 * 同步mint事件
 */
 @Injectable()
 export class EventMintJob extends BaseJobSimple {
  constructor (
    private readonly eth: EthService,
    private readonly contract: EthContractMint,
    @InjectRepository(MintEvent)
    private readonly event: Repository<MintEvent>,
    @InjectRepository(Order)
    private readonly order: Repository<Order>,
  ) {
    super();
  }

  /**
   * 同步数据
   */
  async sync() {
    // 获取初始区块
    const start_block = Number(process.env.START_BLOCK);

    // 找到最后一次任务同步
    let job = await this.event.findOne({
      select: ['id', 'contract_address', 'from_block', 'to_block', 'sync_times'],
      where: { contract_address: ContractAddress[process.env.CHAIN].MetaPassportMinter },
      order: { to_block: 'DESC' },
    });

    // 若无任务记录，则创建初始任务
    if(!job) {
      const jobData = {
        contract_address: ContractAddress[process.env.CHAIN].MetaPassportMinter,
        from_block: start_block,
        to_block: await this.getToBlock(start_block),
        sync_times: 0,
        created_at: new Date(),
        updated_at: new Date(),
      };

      if(jobData.to_block - jobData.from_block < SYNC_JOB_MIN_DRUATION) {
        // 区块间隔小于最小值，跳过
        return this.fail(`Job block diff < min duration (${jobData.from_block} ~ ${jobData.to_block}), skip.`);
      }

      // 存入数据库
      try {
        /*
        save - 保存给定实体或实体数组。    如果该实体已存在于数据库中，则会更新该实体。    如果数据库中不存在该实体，则会插入该实体。
        它将所有给定实体保存在单个事务中（在实体的情况下，管理器不是事务性的）。    因为跳过了所有未定义的属性，还支持部分更新。 */
        job = await this.event.save(jobData);
      } catch(e) {
        throw new Error(e);
      }

      this.debug(`[${EventMintJob.name}]初始化同步任务 [${jobData.from_block}->${jobData.to_block}]`);
    }

    // 若最新同步任务已完成同步，则创建下一个任务
    if(job.sync_times > 0) {
      const jobData = {
        contract_address: job.contract_address,
        from_block: job.to_block + 1,
        to_block: await this.getToBlock(job.to_block + 1),
        sync_times: 0,
        created_at: new Date(),
        updated_at: new Date(),
      };

      if(jobData.to_block - jobData.from_block < SYNC_JOB_MIN_DRUATION) {
        // 区块间隔小于最小值，跳过
        return this.fail(`Job block diff < min duration (${jobData.from_block} ~ ${jobData.to_block}), skip.`);
      }

      // 写入下一个
      try {
        job = await this.event.save(jobData);
      } catch(e) {
        throw new Error(e);
      }

      // 日志通知一下
      // this.debug(`[${EventMintJob.name}]创建下一个同步任务 [${jobData.from_block}->${jobData.to_block}]`);
    }
    else {
      // 批量插入与更新job作为事务一起提交
      let totalCnt = 0;
      try {
        // 针对未同步的任务做处理
        // manager - 存储库使用的EntityManager
        // transaction - 提供在单个数据库事务中执行多个数据库请求的事务。
        await this.event.manager.transaction(async() => {
          // 要根据不同的事件类型区分
          for(let name of ContractEvents.MetaPassportMinter) {
            // 查询该次任务需要处理（记录）的数量
            let results = await this.contract.onEvent(name, job.from_block, job.to_block);
            if(results.length > 0) this.debug(`监听到事件${name}: ${results.length} 个`);
            // 累计事件
            totalCnt += results.length;
            // 根据类型处理
            switch(name) {
            case 'MintOrderCreated':
              // 记录订单 hash号，块号
              for(let r of results) {
                await this.createOrder(r.args, r.transactionHash, r.blockNumber);
              }
              break;
            case 'MintOrderHandled':
              // 变更订单状态 hash号，块号
              for(let r of results) {
                await this.updateOrder(r.args, r.transactionHash, r.blockNumber);
              }
              break;
            }
          }
          // 更新任务
          await this.updateEventJob(job, totalCnt);
        });
      }
      catch(e) {
        throw new Error(e);
      }
    }

    return this.success();
  }

  /** 新增订单记录 */
  async createOrder(result: any, hash: string, block: number): Promise<any> {
    const orderIndex = ethers.utils.formatUnits(result.orderIndex, 0);
    // 容错处理
    if(await this.order.findOneBy({orderIndex:orderIndex})) {
      return this.debug(`[${orderIndex}]号订单已存在, [${hash}][${block}]`);
    }
    const mintType = ethers.utils.formatUnits(result.mintType, 0);
    const from = result.from;
    const state = 'created';
    const mintHash = hash;
    const mintBlock = block;
    const created_at = new Date();
    const updated_at = new Date();
    await this.order.save({ mintType, orderIndex, from, state, mintHash, mintBlock, created_at, updated_at });
  }

  /** 完成订单记录 */
  async updateOrder(result: any, hash: string, block: number): Promise<any> {
    const orderIndex = ethers.utils.formatUnits(result.orderIndex, 0);
    // 容错处理
    if(await this.order.findOneBy({orderIndex:orderIndex, state:'complete'})) {
      return this.debug(`[${orderIndex}]号订单已完成, [${hash}][${block}]`);
    }
    const state = 'complete';
    const handleHash = hash;
    const handleBlock = block;
    const updated_at = new Date();
    // update - 通过给定的更新选项或实体 ID 部分更新实体。
    await this.order.update({orderIndex:orderIndex}, {state, handleHash, handleBlock, updated_at});
  }

  /** 更新事件任务，方便执行下一个任务 */
  async updateEventJob(job: any, total: number) {
    // 更新任务
    await this.event.update({
      id: job.id
    }, {
      sync_times: job.sync_times + 1,
      event_count: total,
      updated_at: new Date(),
    });
  }

  /** 获取事件的最大区块（不超过最新块） */
  async getToBlock(fromBlock:number) {
    const blockNumber = await this.eth.getBlockNumber();
    return Math.min(fromBlock + SYNC_JOB_BLOCK_STEP, blockNumber);
  }

  /////// LOG ///////
  info(msg: string) {
    Logger.log(msg, EventMintJob.name);
  }

  debug(msg: string) {
    Logger.debug(msg, EventMintJob.name);
  }
}