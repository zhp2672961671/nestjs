import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ListAssetsDto {
  @ApiProperty({description:'星球tokenId'})
  @IsString()
  @IsNotEmpty()
  sphereTokenId: string;
}