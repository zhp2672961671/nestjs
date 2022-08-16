import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEthereumAddress } from 'class-validator';

export class SignInAddrDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEthereumAddress()
  address: string;
}
export class SignInAddrResDto {
  @ApiProperty({ description: '签名用消息串' })
  @IsNotEmpty()
  msg: string;
}