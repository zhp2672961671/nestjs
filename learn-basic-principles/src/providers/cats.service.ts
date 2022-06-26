import { Injectable } from '@nestjs/common';
import { Cat } from './interfaces/cat.interface';
// 定义一个提供者。@Injectable()装饰器将 CatsService 类标记为提供者。
@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [];
  findAll(): Cat[] {
    return this.cats;
  }
}