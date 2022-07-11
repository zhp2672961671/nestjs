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