import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { SignInAddrDto, SignInAddrResDto } from './dto/signin-addr.dto';
import { SignedAddrDto, SignedAddrResDto } from './dto/signed-addr.dto';

@ApiTags('认证')
@Controller('api/auth')
export class AuthController {
  // 注入认证服务
  constructor(
    private readonly authService: AuthService,
  ) {}

  /**
   * 获取签名用消息串
   * @param body 包含必要字段 username 即以太坊钱包地址
   * @returns signin message like 'Sign in m3lab.io <kuRvUrnqdb>'
   */
  @Post('signIn')
  @ApiOperation({ summary: '获取登录消息' })
  @ApiResponse({ description: '签名用消息串', status: 201, type: SignInAddrResDto })
  async signIn(@Body() body:SignInAddrDto): Promise<any> {
    return this.authService.cacheMsg(body.address, 'signIn', 5 * 60);
  }

  /**
   * 签名后采用账户登录换取令牌
   * @param req 验证签名和令牌有效期
   * @param body 包含账户(地址)，密码(签名串)
   * @returns
   */
  @UseGuards(LocalGuard)
  @Post('signed')
  @ApiOperation({ summary: '登录并验证签名' })
    // ApiResponse是注解api的参数，也就是用于swagger提供开发者文档，文档中生成的注释内容
  @ApiResponse({ description: 'jwt令牌', status: 201, type: SignedAddrResDto })
  async signed(@Request() req: any, @Body() body:SignedAddrDto): Promise<any> {
    return await this.authService.checkSigned(req.user);
  }
}
