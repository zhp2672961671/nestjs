// OpenAPI是一个与语言无关的RESTful API定义说明，Nest提供了一个专有的模块来利用装饰器生成类似声明。
import { ApiProperty } from '@nestjs/swagger';
// 类验证器 允许使用基于装饰器和非装饰器的验证。内部使用validator.js执行验证。类验证器适用于浏览器和 node.js 平台。
import { IsNotEmpty, IsString, IsEthereumAddress } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  // 使用基本正则表达式检查字符串是否是以太坊地址。不验证地址校验和。
  @IsEthereumAddress()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  avatar: string;

  @ApiProperty()
  roles: string[];
}

export class PayUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  type: string;
}

export class CheckOrderDto {
  @ApiProperty({ description: '订单编号' })
  @IsString()
  @IsNotEmpty()
  orderIndex: string;
}

