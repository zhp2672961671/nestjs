import { Injectable } from "@nestjs/common";
import { BaseJobSimple } from "src/base/base.job";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Order } from "../job.entity";
import { EthContractMint } from "src/blockchain/eth/contract/eth.contract.mint";
import { Logger } from "src/newLog4js/log4js";

// 一次至多处理多少条
const LIMIT_RECORDS = 1;

/**
 * 处理订单的计划
 */
@Injectable()
export class HandleMintJob extends BaseJobSimple {
  constructor(
    private readonly contract: EthContractMint,
    @InjectRepository(Order)
    private readonly order: Repository<Order>,
  ) {
    super();
  }

  /**
   * 同步数据处理
   */
  async sync() {
    // 查找created的订单
    let records = await this.order.find({
      select: ['id', 'orderIndex'],
      where: { state: 'created' },
      order: { orderIndex: 'ASC' },
      take: LIMIT_RECORDS,
    });

    // 遍历处理
    for(let r of records) {
      try {
        await this.order.manager.transaction(async ()=> {
          // 变更订单状态
          await this.order.update(r.id, {
            state: 'pending',
            updated_at: new Date(),
          });
          // 服务器处理handle
          await this.contract.handleMintOrder(Number(r.orderIndex));
          // 日志通知一下
          this.debug(`[${HandleMintJob.name}]提交订单编号:[${r.orderIndex}]`);
        });
      }
      catch(e) {
        throw new Error(e);
      }
    }

    return this.success();
  }

  /////// LOG ///////
  info(msg: string) {
    Logger.log(msg, HandleMintJob.name);
  }

  debug(msg: string) {
    Logger.debug(msg, HandleMintJob.name);
  }
}