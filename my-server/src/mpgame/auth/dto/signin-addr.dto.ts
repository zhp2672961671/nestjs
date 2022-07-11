import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEthereumAddress } from 'class-validator';

export class SignInAddrDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEthereumAddress()
  address: string;
}