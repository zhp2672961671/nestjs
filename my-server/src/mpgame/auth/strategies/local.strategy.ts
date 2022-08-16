// Passport 提供了一种名为 Passport-local 的策略，它实现了一种用户名/密码身份验证机制，这符合我们在这一部分用例中的需求。
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { Injectable } from '@nestjs/common';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';

/**
 * 默认本地策略名字为 ‘local'
 * 调整策略名可在护照策略中传入名字
 * 对应守卫变更名字
 */

@Injectable()
/*
首先定义了一个LocalStorage继承至@nestjs/passport提供的PassportStrategy类, 接受两个参数

第一个参数: Strategy，你要用的策略，这里是passport-local

第二个参数:是策略别名，上面是passport-local,默认就是local
 */
export class LocalStrategy extends PassportStrategy(Strategy) {
  // 注入认证服务
  constructor(private moduleRef: ModuleRef) {
    // 调用super传递策略参数， 这里如果传入的就是username和password，可以不用写，使用默认的参数就是，比如我们是用邮箱进行验证，
    // 传入的参数是email, 那usernameField对应的value就是email。
    super({
      usernameField: 'address',
      passwordField: 'result',
    });
  }

  // // 用户名密码验证
  // // validate是LocalStrategy的内置方法， 主要实现了用户查询以及密码对比，因为存的密码是加密后的，
  // // 没办法直接对比用户名密码，只能先根据用户名查出用户，再比对密码。
  // async validate(useranme: string, password: string): Promise<any> {
  //   return await this.authService.validateUser(useranme, password);
  // }
  // 用户名密码验证
  async validate(request: any, useranme: string, password: string): Promise<any> {
    // return await this.authService.validateUser(useranme, password);
    // 使用ContextIdFactory类的getByRequest()方法来基于请求对象创建一个上下文id 并传递resolve()调用:
    const contextId = ContextIdFactory.getByRequest(request);
    // "AuthService" is a request-scoped provider
    // resolve()方法从其自身的注入容器树返回一个提供者的唯一实例
    const authService = await this.moduleRef.resolve(AuthService, contextId);
    return await authService.validateUser(useranme, password);
  }
}
