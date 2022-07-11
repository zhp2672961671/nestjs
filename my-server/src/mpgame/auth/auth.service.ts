import { Injectable, UnauthorizedException, CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { EthService } from 'src/blockchain/eth/eth.service';
import { Logger } from 'src/newLog4js/log4js';

@Injectable()
export class AuthService {
  // 构造注入用户服务
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly ethService: EthService,
    @Inject(CACHE_MANAGER)
    private cache: Cache,
  ) {}

  /**
   * 本地校验策略
   * @param address 用户名即以太坊地址
   * @param result 密码即签名消息串
   * @returns
   */
  async validateUser(address: string, result: string): Promise<any> {
    // 如果缓存中无用户信息，报401
    const msg = await this.cache.get<string>(address);
    if(!msg) {
      Logger.warn(`${address} signin msg timeout!`, AuthService.name);
      throw new UnauthorizedException();
    }

    // 验签过程
    try {
      const ret = this.ethService.checkSigned(address, msg, result);
      if(ret === false) {
        Logger.warn(`${address} incorrect signed msg!`, AuthService.name);
        return null;
      }
    } catch(e) {
      Logger.warn(`${address} signed msg has error!`, AuthService.name);
      throw new UnauthorizedException();
    }

    // 去我方数据中心验证账户存在
    const user = await this.usersService.findOneByAddress(address);
    if(user) return user;

    // 如果不存在则注册用户
    return await this.usersService.create(address);
  }

  /**
   * 缓存消息
   * @param address 钱包地址即账号
   * @param types 消息类型
   * @param time 缓存有效期，默认5秒
   */
  async cacheMsg(address: string, types: string, time: number = 5): Promise<any> {
    // 创建一个以太坊消息
    const msg = this.ethService.createMessage(types);
    console.log("msg===============",msg)
    // 缓存信息
    await this.cache.set(address, msg, { ttl: time });
    // 返回
    return {
      errCode: 0,
      errMsg: 'success',
      data: { msg },
    };
  }

  /**
   * 验签结束后制造令牌
   * @param user
   * @returns 令牌
   */
  async checkSigned(user: any): Promise<any> {
    /*
    sign 方法是 jsonwebtoken 的一个实现.sign()。与 jsonwebtoken 不同，它还允许附加secret、privateKey和publicKey属性options来覆盖从模块传入的选项。
    它只覆盖secret,publicKey或者privateKey虽然不是secretOrKeyProvider. */
    let token = this.jwtService.sign({
      id: user.id,
      address: user.address,
      roles: user.roles,
      avatar: user.avatar,
    });
    console.log("token=========",token)
    return {
      errCode: 0,
      errMsg: 'success',
      data: { token }
    };
  }
}
