import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEthereumAddress, IsString } from 'class-validator';

export class SignedAddrDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEthereumAddress()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  result: string;
}
export class SignedAddrResDto {
  @ApiProperty({ description: 'jwt令牌' })
  @IsNotEmpty()
  token: string;

  @ApiProperty({ description: '令牌过期时间' })
  @IsNotEmpty()
  timestamp: number;
}