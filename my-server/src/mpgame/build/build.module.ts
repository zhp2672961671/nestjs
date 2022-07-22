import { Module } from '@nestjs/common';
import { BuildController } from './build.controller';
import { BuildService } from './build.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Build } from './build.entity';
import { BuildSchedule } from './build.schedule';
import { JobModule } from '../job/job.module';
import { GeoModule } from '../geo/geo.module';
import { AssetsModule } from '../assets/assets.module';

@Module({
  imports: [TypeOrmModule.forFeature([
    Build
  ]), JobModule, GeoModule, AssetsModule],
  controllers: [BuildController],
  providers: [BuildService, BuildSchedule]
})
export class BuildModule {}
