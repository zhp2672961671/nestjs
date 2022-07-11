import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtConstants } from 'src/app.config';

/**
 * 默认jwt策略名字为 ‘jwt'
 * 调整策略名可在护照策略中传入名字
 * 对应守卫变更名字
 */

 @Injectable()
 export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // jwtFromRequest:提供从请求中提取 JWT 的方法。我们将使用在 API 请求的授权头中提供token的标准方法。这里描述了其他选项。
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      /*
      ignoreExpiration:为了明确起见，我们选择默认的 false 设置，它将确保 JWT 没有过期的责任委托给 Passport 模块。这意味着，如果我们的路由提供了一个过期的 JWT ，
      请求将被拒绝，并发送 401 未经授权的响应。护照会自动为我们办理。
       */
      ignoreExpiration: false,
      // secret orkey:我们使用权宜的选项来提供对称的秘密来签署令牌
      secretOrKey: JwtConstants.SECRET,
    });
  }

  async validate(payload: any) {
    const { id, address, roles, avatar } = payload;
    return {
      id,
      address,
      roles,
      avatar,
    };
  }
 }