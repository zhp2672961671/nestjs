import { Module } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { AssetsController } from './assets.controller';
import { Assets } from './assets.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobModule } from '../job/job.module';

@Module({
  imports: [TypeOrmModule.forFeature([
    Assets,
  ]), JobModule],
  providers: [AssetsService],
  controllers: [AssetsController],
  exports: [AssetsService] 
})
export class AssetsModule {}
