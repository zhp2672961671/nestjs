import { Injectable } from '@nestjs/common';
import { ethers, BigNumber } from 'ethers';
import { WalletMessage, blockchain_rpc_url } from './eth.config';
// Generate Password 是一个（相对）广泛的库，用于生成随机和唯一的密码。
import * as generator from 'generate-password';

@Injectable()
export class EthService {
  private provider: any;
  private signer: any;

  constructor(
  ) {
    // 初始化provider
    try {
      let providers = [];
      // 定制 URL 连接 :
      /*
      JsonRpcProvider （派生于Provider）属性
      prototype . connection
      描述JSON-RPC 节点与属性的连接对象：

      url — the JSON-RPC URL

      user — 用于基本身份验证的用户名 (可选)

      password — 用于基本身份验证的密码 (可选)

      allowInsecure — 允许通过不安全的HTTP网络进行基本身份验证 */
      for(let one of blockchain_rpc_url[process.env.CHAIN]) providers.push(new ethers.providers.JsonRpcProvider(one));
      this.provider = new ethers.providers.FallbackProvider(providers);
    } catch(e) {
      throw new Error(e);
    }

    // 初始化signer, 这时候还不需要上链
    try {
      this.signer = new ethers.Wallet(process.env.COO_SK);
    } catch(e) {
      throw new Error(e);
    }
  }

  /**
   * 获取最新区块号
   */
  async getBlockNumber(): Promise<number> {
    return await this.provider.getBlockNumber();
  }

  /**
   * 获取区块
   * @param blockNumber 区块号
   */
  async getBlock(blockNumber: number): Promise<any> {
    return await this.provider.getBlock(blockNumber);
  }

  /**
   * 获取eth余额
   * @param address 钱包地址
   * @returns 钱包余额（BigNumber类型）
   */
  async getBalance(address: string): Promise<BigNumber> {
    return await this.provider.getBalance(address);
  }

  /**
   * 签名操作
   * @param msg 消息体
   */
  async signMessage(msg: string): Promise<string> {
    return await this.signer.signMessage(msg);
  }

  /**
   * 创建一个以太坊账号
   */
  createAccount(): any {
    const wallet = ethers.Wallet.createRandom();
    return { address: wallet.address, privateKey: wallet.privateKey };
  }

  /**
   * 制造一个随机消息
   * @param types 消息类型
   */
  createMessage(types: string): string {
    // 默认长度10
    const rand = generator.generate({
      length: 10,
    });
    return WalletMessage[types] + " <" + rand + ">";
  }

  /**
   * 校验签名
   * @param address 账号即以太坊地址
   * @param signInMsg 登录操作的消息串
   * @param signedStr 针对登录消息串的加密签名串
   * @returns 返回地址是否一致的结果
   */
  checkSigned(address: string, signInMsg: string, signedStr: string): boolean {
    // 哈希签名明文串
    let hexMsg = ethers.utils.hashMessage(signInMsg);

    // 解析得到一个地址
    let recoverAddr = ethers.utils.recoverAddress(hexMsg, signedStr);

    // 返回一个校验结果
    return address === recoverAddr;
  }

  /**
   * 获取signer, 即管理员对象
   */
  getSigner(onChain: boolean = true): any {
    if(onChain) return new ethers.Wallet(process.env.COO_SK, this.provider);
    return this.signer;
  }

  /**
   * 获取管理员(COO)地址
   * @returns address
   */
  getAdminAddress(): string {
    return this.signer.address;
  }

  /**
   * 获取私钥
   * @param {*} address 地址
   */
  async getPrivateKey(address: string): Promise<string> {
    let privateKey = null;
    switch(address) {
      // fund
      case this.signer.address:
        privateKey = this.signer.privateKey;
        break;

      // normal user
      default:
        privateKey = this.signer.privateKey;
    }

    return privateKey;
  }

  /**
   * 获取合约事件
   * @param {*} addr 合约地址
   * @param {*} abi 合约abi
   * @param {*} from 开始区块
   * @param {*} to 结束区块
   */
  async getEventsByContract(addr: string, abi: any, from: number, to: number): Promise<any> {
    const contract = new ethers.Contract(addr, abi, this.signer);
    const filter = contract.filters.Transfer();
    return await contract.queryFilter(filter, from, to);
  }
}
