import { Injectable } from '@nestjs/common';
// https://learnblockchain.cn/docs/ethers.js/api-utils.html
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

      allowInsecure — 允许通过不安全的HTTP网络进行基本身份验证
      new ethers . providers . FallbackProvider( providers )
      通过依次尝试每个 提供者Provider 来提高可靠性，如果遇到错误，则返回列表中的下一个提供程序。 网络由 提供者Provider 确定，必须 相互匹配。
      */
      for(let one of blockchain_rpc_url[process.env.CHAIN]) providers.push(new ethers.providers.JsonRpcProvider(one));
      this.provider = new ethers.providers.FallbackProvider(providers);
    } catch(e) {
      throw new Error(e);
    }

    // 初始化signer, 这时候还不需要上链
    try {
      //  Wallet类管理着一个公私钥对用于在以太坊网络上密码签名交易以及所有权证明。
      /*
      创建 Wallet 实例
      new Wallet ( privateKey [ , provider ] )
      从参数 privateKey 私钥创建一个钱包实例， 还可以提供一个可选的 提供者Provider 参数用于连接节点
       */
      this.signer = new ethers.Wallet(process.env.COO_SK);
    } catch(e) {
      // console.log("e=====================",e)
      throw new Error(e);
    }
  }

  /**
   * 获取最新区块号
   * 返回最新区块号（Number类型）的 Promise 。
   */
  async getBlockNumber(): Promise<number> {
    return await this.provider.getBlockNumber();
  }

  /**
   * 获取区块
   * @param blockNumber 区块号
   * 返回给定参数对应的区块信息的 Promise (参考: 区块回复) 。
   */
  async getBlock(blockNumber: number): Promise<any> {
    return await this.provider.getBlock(blockNumber);
  }

  /**
   * 获取eth余额
   * @param address 钱包地址
   * @returns 钱包余额（BigNumber类型）
   * 获取账号信息
  prototype . getBalance ( addressOrName [ , blockTag = “latest” ] )   =>   Promise<BigNumber>
  返回参数 addressOrName 余额的（类型为 BigNumber ） Promise 对象。 可选参数 blockTag (参考: Block Tags) 指定一个区块。
   */
  async getBalance(address: string): Promise<BigNumber> {
    return await this.provider.getBalance(address);
  }

  /**
   * 签名操作
   * @param msg 消息体
   * 对 message 签名返回 Promise ，从中可以获取 flat-format 的签名信息。
    如果 message 是一个字符串, 它被转换为UTF-8字节，否则使用数据用 Arrayish 表示的二进制。
   */
  async signMessage(msg: string): Promise<string> {
    return await this.signer.signMessage(msg);
  }

  /**
   * 创建一个以太坊账号
   * Wallet . createRandom ( [ options ] )   =>   Wallet
    创建一个随机钱包实例。 确保钱包（私钥）存放在安全的位置，如果丢失了就**没有办法找回钱包**。
    额外的参数 options 为：
    extraEntropy — 额外的熵加入随机源
    prototype . privateKey
    钱包的私钥; 注意保密。
    prototype . address
    获得 钱包Wallet 地址
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
    // 使用给定选项生成一个密码。返回一个字符串。
    // length: 10,numbers: true
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
    /*
    实用程序。hashMessage (stringOrArrayish)   =>   十六进制
    通过将消息转换为字节（根据需要）并加上消息的前缀和长度，计算 stringOrArrayish 的前缀消息哈希。
    */
    let hexMsg = ethers.utils.hashMessage(signInMsg);
    // 解析得到一个地址
    // recoverAddress 通过使用带有签名摘要的 ecrecover 返回以太坊地址。
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
   * 合约是在以太坊区块链上的可执行程序的抽象。合约具有代码 (称为字节代码) 以及分配的长期存储 (storage)。
   * 每个已部署的合约都有一个地址, 用它连接到合约, 可以向其发送消息来调用合约方法
   * 获取合约事件
   * @param {*} addr 合约地址
   * @param {*} abi 合约abi
   * @param {*} from 开始区块
   * @param {*} to 结束区块
   */
  async getEventsByContract(addr: string, abi: any, from: number, to: number): Promise<any> {
    // 连接合约
    const contract = new ethers.Contract(addr, abi, this.signer);
    //prototype . filters . eventname 生成过滤器的函数，该过滤器使用该 函数按事件值过滤
    const filter = contract.filters.Transfer();
    return await contract.queryFilter(filter, from, to);
  }
}
