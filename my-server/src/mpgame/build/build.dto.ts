import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsArray, IsObject } from 'class-validator';

export class GetBuildDto {
  @ApiProperty({description:'星球tokenId'})
  @IsString()
  @IsNotEmpty()
  sphereTokenId: string;

  @ApiProperty({description:'建筑id'})
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class ListBuildDto {
  @ApiProperty({description:'星球tokenId'})
  @IsString()
  @IsNotEmpty()
  sphereTokenId: string;

  @ApiProperty({description:'是否访客'})
  visited: boolean;
}

export class CreateBuildDto {
  @ApiProperty({description:'星球tokenId'})
  @IsString()
  @IsNotEmpty()
  sphereTokenId: string;

  @ApiProperty({description:'建筑typeId'})
  @IsNumber()
  @IsNotEmpty()
  typeId: number;

  @ApiProperty({description:'建筑type'})
  @IsNumber()
  @IsNotEmpty()
  type: number;

  @ApiProperty({description:'建筑基准X'})
  @IsNumber()
  @IsNotEmpty()
  gridX: number;

  @ApiProperty({description:'建筑基准Y'})
  @IsNumber()
  @IsNotEmpty()
  gridY: number;

  @ApiProperty({description:'建筑占地形态'})
  @IsNumber()
  @IsNotEmpty()
  typeGrid: number;

  @ApiProperty({description:'建筑行为形态'})
  @IsNumber()
  @IsNotEmpty()
  behaviorId: number;
}

export class RemoveBuildDto {
  @ApiProperty({description:'星球tokenId'})
  @IsString()
  @IsNotEmpty()
  sphereTokenId: string;

  @ApiProperty({description:'删除列表'})
  @IsArray()
  ids: string[];
}

export class WorkBuildDto {
  @ApiProperty({description:'星球tokenId'})
  @IsString()
  @IsNotEmpty()
  sphereTokenId: string;
  
  @ApiProperty({description:'建筑id'})
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({description:'分配量'})
  @IsNumber()
  @IsNotEmpty()
  slot: number;
}

export class FarmBuildDto {
  @ApiProperty({description:'星球tokenId'})
  @IsString()
  @IsNotEmpty()
  sphereTokenId: string;
  
  @ApiProperty({description:'建筑id'})
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class UpgradeBuildDto {
  @ApiProperty({description:'星球tokenId'})
  @IsString()
  @IsNotEmpty()
  sphereTokenId: string;
  
  @ApiProperty({description:'建筑id'})
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class MoveBuildDto {
  @ApiProperty({description:'星球tokenId'})
  @IsString()
  @IsNotEmpty()
  sphereTokenId: string;
  
  @ApiProperty({description:'建筑id'})
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({description:'坐标y'})
  @IsNumber()
  @IsNotEmpty()
  gridX: number;

  @ApiProperty({description:'坐标y'})
  @IsNumber()
  @IsNotEmpty()
  gridY: number;
}

export class OpenBuildDto {
  @ApiProperty({description:'星球tokenId'})
  @IsString()
  @IsNotEmpty()
  sphereTokenId: string;
  
  @ApiProperty({description:'建筑id'})
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class RepoBuildDto {
  @ApiProperty({description:'星球tokenId'})
  @IsString()
  @IsNotEmpty()
  sphereTokenId: string;
  
  @ApiProperty({description:'建筑id'})
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({description:'资源{K:V}格式'})
  @IsObject()
  value: object;
}

export class BuildDataType {
  @ApiProperty({description:'星球tokenId'})
  sphereTokenId: string;

  @ApiProperty({description:'建筑uuid'})
  id: string;

  @ApiProperty({description:'建筑typeId'})
  typeId: number;

  @ApiProperty({description:'建筑type'})
  type: number;

  @ApiProperty({description:'建筑x'})
  gridX: number;

  @ApiProperty({description:'建筑y'})
  gridY: number;

  @ApiProperty({description:'占地形态'})
  typeGird: number;

  @ApiProperty({description:'建筑形态'})
  behaviorId: number;

  @ApiProperty({description:'建造时间'})
  start_time: number;

  @ApiProperty({description:'工作时间'})
  work_time: number;

  @ApiProperty({description:'收获时间'})
  farm_time: number;

  @ApiProperty({description:'资源存放, 仓库类型使用'})
  repo_list: string[];

  @ApiProperty({description:'等级'})
  level: number;

  @ApiProperty({description:'人口数，房子类型使用'})
  pop: number;

  @ApiProperty({description:'资源数，资源类型使用'})
  res: number;

  @ApiProperty({description:'工位填充优先级(0-9), 有工位的建筑使用'})
  slot: number;

  @ApiProperty({description:'学点，图书馆使用'})
  point: number;
}
