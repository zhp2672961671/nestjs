import { Injectable } from "@nestjs/common";
import { EthService } from "../eth.service";
import { ethers } from 'ethers';
import { abiFromJson } from "src/app.utils";
import { ContractAddress } from "../eth.config";

/**
 * Mint合约
 * 合约单例集成coo账号
 */

@Injectable()
export class EthContractMint {
  // 内部单例
  private contract: any;

  // 构造注入服务
  constructor(
    private readonly ethService: EthService,
  ) {}

  // 单例
  getInstance(): any {
    if(!this.contract) {
      const addr = ContractAddress[process.env.CHAIN].MetaPassportMinter;
      const abi = abiFromJson("MetaPassportMinter.json");
      const signer = this.ethService.getSigner();
      this.contract = new ethers.Contract(addr, abi, signer);
    }
    // console.log(" this.contract.filters===============", this.contract.filters)
    return this.contract;
  }

  // 获取mini费用
  // 1-4 四个档位
  async getMintFee(type: number): Promise<any> {
    const contract = this.getInstance();
    let fee = await contract.mint1Fee();
    // 返回值的字符串表示形式
    console.log(ethers.utils.formatEther(fee));
  }

  // mint操作
  async Mint(): Promise<any> {
    const contract = this.getInstance();
    let from = "0x6D6453dEf2bbE5d6470A009715fc0bF83AEc640B";
    let fee = await contract.mint1Fee();
    console.log(ethers.utils.formatEther(fee));
    let result = await contract.mint1({ from: from, value: fee, gasLimit: 2000000 });
    console.log(result);
  }

  // box操作
  async Box(): Promise<any> {
    const contract = this.getInstance();
    let from = "0x6D6453dEf2bbE5d6470A009715fc0bF83AEc640B";
    let fee = await contract.mintBoxFee();
    console.log(ethers.utils.formatEther(fee));
    let result = await contract.mintMysteryBox([1], { from: from, value: fee, gasLimit: 2000000 });
    console.log(result);
  }

  // 手工查询
  async HandleMiniOrderCreated(): Promise<any> {
    const contract = this.getInstance();
    const lb = 18619800;
    const nb = 18615800;

    // let filter = contract.filters.MintOrderCreated();
    //filters 事件过滤器由主题组成，主题是记录在Bloom Filter中的值，允许有效搜索与过滤器匹配的条
    let filter = contract.filters.MintOrderHandled();
    // queryFilter返回与事件匹配的事件。
    let ret = await contract.queryFilter(filter, nb, lb);
    console.log(ret);
  }

  // 采用过滤器事件查询
  async onEvent(event_name: string, start_block: number, last_block: number): Promise<any> {
    const contract = this.getInstance();
    let filter = contract.filters[event_name]();
    // const lb = 18582000;
    // const nb = 18581000;
    return await contract.queryFilter(filter, start_block, last_block);
  }

  // 提交订单
  async handleMintOrder(orderIndex: number): Promise<any> {
    const contract = this.getInstance();
    try {
      await contract.handleMintOrder(orderIndex, { gasLimit: 2000000 });
    } catch(e) {
      throw new Error(e);
    }
  }

  // 设置开盲盒时间
  async setMysteryBoxRound(setBoxDto: any): Promise<any> {
    const contract = this.getInstance();
    const endTime = setBoxDto.endTime || Math.round(new Date().getTime() / 1000 + 3600);
    const round = setBoxDto.round || 1;
    const userLimit = setBoxDto.userLimit || 10;
    const totalLimit = setBoxDto.totalLimit || 0;
    try {
      await contract.setMysteryBoxRound(round, endTime, totalLimit, userLimit);
      return '配置完成';
    } catch(e) {
      throw new Error(e);
    }
  }

  // 查询当前盲盒活动结束时间戳（单位秒）
  async getMysteryBoxRoundEndTime(): Promise<any> {
    const contract = this.getInstance();
    try {
      let ret = await contract.getMysteryBoxRoundEndTime();
      // formatUnits返回值的字符串表示形式，格式为单位数字（如果是数字）或指定的单位（如果是字符串）
      let endTime = ethers.utils.formatUnits(ret, 0);
      return '截至时间戳为:' + endTime + ' (单位秒)';
    } catch(e) {
      throw new Error(e);
    }
  }

  // 查询当前盲盒活动是否进行中
  async isMysteryBoxRoundOpening(): Promise<any> {
    const contract = this.getInstance();
    try {
      let ret = await contract.isMysteryBoxRoundOpening();
      if(ret) return '当前处于开盲盒时间段';
      return '当前不处于开盲盒时间，请等待';
    } catch(e) {
      throw new Error(e);
    }
  }
}