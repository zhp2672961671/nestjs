import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GetGeoDto {
  @ApiProperty({description:'星球tokenId'})
  @IsString()
  @IsNotEmpty()
  sphereTokenId: string;

  @ApiProperty({description:'是否访客'})
  visited: boolean;
}

export class SyncGeoDto {
  @ApiProperty({description:'星球id'})
  @IsString()
  @IsNotEmpty()
  sphereTokenId: string;

  @ApiProperty({description:'地形数据集'})
  @IsNotEmpty()
  list: string[];
}

export class ChangeGeoDto {
  @ApiProperty({description:'星球id'})
  @IsString()
  @IsNotEmpty()
  sphereTokenId: string;

  @ApiProperty({description:'要改遍的地形值,格式0x00000000'})
  @IsNotEmpty()
  @IsString()
  geography: string;

  @ApiProperty({description:'地块x'})
  @IsNotEmpty()
  @IsNumber()
  gridX: number;

  @ApiProperty({description:'地块y'})
  @IsNotEmpty()
  @IsNumber()
  gridY: number;
}

export class ResetGeoDto {
  @ApiProperty({description:'星球tokenId'})
  @IsString()
  @IsNotEmpty()
  sphereTokenId: string;
}

export class RandomGeoDto {
  @ApiProperty({description:'星球id'})
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({description:'x起始'})
  @IsNotEmpty()
  @IsNumber()
  sx: number;

  @ApiProperty({description:'y起始'})
  @IsNotEmpty()
  @IsNumber()
  sy: number;

  @ApiProperty({description:'x范围'})
  @IsNotEmpty()
  @IsNumber()
  rangeX: number;

  @ApiProperty({description:'y范围'})
  @IsNotEmpty()
  @IsNumber()
  rangeY: number;

  @ApiProperty({description:'数量'})
  @IsNotEmpty()
  @IsNumber()
  num: number;

  @ApiProperty({description:'替换格数字编号'})
  @IsNotEmpty()
  @IsNumber()
  targetGid: number;

  @ApiProperty({description:'可替换列表（数字编号）'})
  canChangeGid: number[];
}