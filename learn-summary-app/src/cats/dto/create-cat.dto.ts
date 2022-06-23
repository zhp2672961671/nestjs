// 向 CreateCatDto 类添加一些装饰器。
import { IsString, IsInt } from 'class-validator';
export class CreateCatDto {
  @IsString()
  name: string;
  @IsInt()
  age: number;
  @IsString()
  breed: string;
}
export class UpdateCatDto {
  readonly name: string;
  readonly age: number;
  readonly breed: string;
}
export class ListAllEntities {
  readonly limit: string;
  readonly age: number;
  readonly breed: string;
}