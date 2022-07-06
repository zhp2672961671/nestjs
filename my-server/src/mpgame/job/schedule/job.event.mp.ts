import { Injectable } from "@nestjs/common";
import { BaseJobSimple } from "src/base/base.job";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EthService } from "src/blockchain/eth/eth.service";
import { MpEvent, Passport } from "../job.entity";
import { ContractAddress, ContractEvents } from "src/blockchain/eth/eth.config";
import { EthContractMp } from "src/blockchain/eth/contract/eth.contract.mp";
import { ethers } from "ethers";
import { Logger } from "src/newLog4js/log4js";

/** 同步事件任务，每次区块范围 */
const SYNC_JOB_BLOCK_STEP = 99;

/** 同步事件任务，区块之间最少间隔，小于该间隔，任务取消 */
const SYNC_JOB_MIN_DRUATION = 1;

/**
 * 处理mp被mint的计划
 */
@Injectable()
export class EventMpJob extends BaseJobSimple {
  constructor(
    private readonly eth: EthService,
    private readonly contract: EthContractMp,
    @InjectRepository(MpEvent)
    private readonly event: Repository<MpEvent>,
    @InjectRepository(Passport)
    private readonly passport: Repository<Passport>,
  ) {
    super();
  }

  /**
   * 同步数据处理
   */
  async sync() {
    // 获取初始区块
    const start_block = Number(process.env.START_BLOCK);

    // 找到最后一次任务同步
    let job = await this.event.findOne({
      select: ['id', 'contract_address', 'from_block', 'to_block', 'sync_times'],
      where: { contract_address: ContractAddress[process.env.CHAIN].MetaPassport },
      order: { to_block: 'DESC' },
    });

    // 若无任务记录，则创建初始任务
    if (!job) {
      const jobData = {
        contract_address: ContractAddress[process.env.CHAIN].MetaPassport,
        from_block: start_block,
        to_block: await this.getToBlock(start_block),
        sync_times: 0,
        created_at: new Date(),
        updated_at: new Date(),
      };

      if (jobData.to_block - jobData.from_block < SYNC_JOB_MIN_DRUATION) {
        // 区块间隔小于最小值，跳过
        return this.fail(`Job block diff < min duration (${jobData.from_block} ~ ${jobData.to_block}), skip.`);
      }

      // 存入数据库
      try {
        job = await this.event.save(jobData);
      } catch (e) {
        throw new Error(e);
      }

      this.debug(`[${EventMpJob.name}]初始化同步任务 [${jobData.from_block}->${jobData.to_block}]`);
    }

    // 若最新同步任务已完成同步，则创建下一个任务
    if (job.sync_times > 0) {
      const jobData = {
        contract_address: job.contract_address,
        from_block: job.to_block + 1,
        to_block: await this.getToBlock(job.to_block + 1),
        sync_times: 0,
        created_at: new Date(),
        updated_at: new Date(),
      };

      if (jobData.to_block - jobData.from_block < SYNC_JOB_MIN_DRUATION) {
        // 区块间隔小于最小值，跳过
        return this.fail(`Job block diff < min duration (${jobData.from_block} ~ ${jobData.to_block}), skip.`);
      }

      // 写入下一个
      try {
        job = await this.event.save(jobData);
      } catch (e) {
        throw new Error(e);
      }

      // 日志通知一下
      // this.debug(`[${EventMpJob.name}]创建下一个同步任务 [${jobData.from_block}->${jobData.to_block}]`);
    }
    else {
      // 批量插入与更新job作为事务一起提交
      let totalCnt = 0;
      try {
        // 针对未同步的任务做处理
        await this.event.manager.transaction(async () => {
          // 要根据不同的事件类型区分
          for (let name of ContractEvents.MetaPassport) {
            // 查询该次任务需要处理（记录）的数量
            let results = await this.contract.onEvent(name, job.from_block, job.to_block);
            if (results.length > 0) this.debug(`监听到事件${name}: ${results.length} 个`);
            // 累计事件
            totalCnt += results.length;
            // 根据类型处理
            switch (name) {
              case 'MetaPassportMint':
                for (let r of results) {
                  await this.metapassportMinted(r.args);
                }
                break;
              case 'SetCurrentAvatarPart':
                for (let r of results) {
                  await this.setCurrentAvatarPart(r.args);
                }
                break;
            }
          }
          // 更新任务
          await this.updateEventJob(job, totalCnt);
        });
      }
      catch (e) {
        throw new Error(e);
      }
    }

    return this.success();
  }

  /**
   * metapassport minted
   */
  async metapassportMinted(result: any) {
    const address = result.to;
    const mpTokenId = result.tokenId.toHexString();
    // 容错过滤
    const passport = await this.passport.findOneBy({ address: address });
    if (passport && passport.mpTokenId) {
      return this.debug(`[${address}] 已经有metapassport [${passport.mpTokenId}]`);
    }
    const created_at = new Date();
    const updated_at = new Date();
    // 创建一张新的护照
    await this.passport.save({ mpTokenId, address, updated_at, created_at });
  }

  /**
   * 形象被使用
   */
  async setCurrentAvatarPart(result: any) {
    const mpTokenId = result.mpTokenId.toHexString();
    // 容错处理
    if (!await this.passport.findOneBy({ mpTokenId: mpTokenId })) {
      return this.debug(`[${mpTokenId}] 无此记录`);
    }

    // 拼接护照形象
    const v1 = ethers.utils.formatUnits(result.avatarPartIds[0].and(0xFFFF), 0);
    const v2 = ethers.utils.formatUnits(result.avatarPartIds[1].and(0xFFFF), 0);
    const v3 = ethers.utils.formatUnits(result.avatarPartIds[2].and(0xFFFF), 0);
    const v4 = ethers.utils.formatUnits(result.avatarPartIds[3].and(0xFFFF), 0);
    const img = v1 + "_" + v2 + "_" + v3 + "_" + v4;

    // 写入数据库
    await this.passport.update({ mpTokenId: mpTokenId }, {
      use: img,
      updated_at: new Date(),
    });
  }

  /**
   * 更新事件任务，方便执行下一个任务
   */
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

  /**
   * 获取事件的最大区块（不超过最新块）
   */
  async getToBlock(fromBlock: number) {
    const blockNumber = await this.eth.getBlockNumber();
    return Math.min(fromBlock + SYNC_JOB_BLOCK_STEP, blockNumber);
  }

  /////// LOG ///////
  info(msg: string) {
    Logger.log(msg, EventMpJob.name);
  }

  debug(msg: string) {
    Logger.debug(msg, EventMpJob.name);
  }
}