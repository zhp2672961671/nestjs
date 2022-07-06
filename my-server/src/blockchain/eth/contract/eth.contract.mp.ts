import { Injectable } from "@nestjs/common";
import { EthService } from "../eth.service";
import { ethers } from 'ethers';
import { abiFromJson } from "src/app.utils";
import { ContractAddress } from "../eth.config";

/**
 * MP合约处理
 */
@Injectable()
export class EthContractMp {
  // 内部单例
  private contract: any;

  // 构造注入服务
  constructor(
    private readonly ethService: EthService,
  ) {}

  // 单例
  getInstance(): any {
    if(!this.contract) {
      const addr = ContractAddress[process.env.CHAIN].MetaPassport;
      const abi = abiFromJson("MetaPassport.json");
      const signer = this.ethService.getSigner();
      this.contract = new ethers.Contract(addr, abi, signer);
    } 
    return this.contract;
  }

  // 采用过滤器事件查询
  async onEvent(event_name: string, start_block: number, last_block: number): Promise<any> {
    const contract = this.getInstance();
    const filter = contract.filters[event_name]();
    return await contract.queryFilter(filter, start_block, last_block);
  }

  // 查看mp 
  async getMetaPassport(address: string): Promise<any> {
    const contract = this.getInstance();
    try {
      const value = await contract.getMetaPassport(address);
      return ethers.utils.formatUnits(value, 0);
    } catch(e) {
      throw new Error(e);
    }
  }

  // 使用操作
  async setMyCurrentAvatar(partIds: string[]): Promise<any> {
    const contract = this.getInstance();
    try {
      let ret = await contract.setMyCurrentAvatar(partIds);
      console.log(ret);
    } catch(e) {
      throw new Error(e);
    }
  }
}