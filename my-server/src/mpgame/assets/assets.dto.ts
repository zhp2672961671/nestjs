import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ListAssetsDto {
  @ApiProperty({ description: '星球tokenId' })
  @IsString()
  @IsNotEmpty()
  sphereTokenId: string;
}

export class ListAssetsResDto {
  @ApiProperty({ description: '星球tokenId' })
  @IsString()
  @IsNotEmpty()
  sphereTokenId: string;

  @ApiProperty({ description: 'id' })
  id: string;

  @ApiProperty({ description: '淡水' })
  1: number;

  @ApiProperty({ description: '矿石' })
  2: number;

  @ApiProperty({ description: '木头' })
  3: number;

  @ApiProperty({ description: '麦子' })
  4: number;

  @ApiProperty({ description: '钉子' })
  5: number;

  @ApiProperty({ description: '人口' })
  6: number;

  @ApiProperty({ description: '幸福度' })
  7: number;

  @ApiProperty({ description: '学点' })
  8: number;

  @ApiProperty({ description: '空闲' })
  9: number;

  @ApiProperty({ description: '创建时间' })
  created_at: Date;

  @ApiProperty({ description: '修改时间' })
  updated_at: Date;
}

