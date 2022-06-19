import { Global, Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
// 全局
@Global()
@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService]
})
// export class CatsModule {}
export class CatsModule {
  constructor(private readonly catsService: CatsService) {}
}
