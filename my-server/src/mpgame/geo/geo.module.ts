import { Module } from '@nestjs/common';
import { GeoController } from './geo.controller';
import { GeoService } from './geo.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Geography } from './geo.entity';
import { JobModule } from '../job/job.module';

@Module({
  imports: [TypeOrmModule.forFeature([
    Geography,
  ]), JobModule],
  exports: [GeoService], 
  controllers: [GeoController],
  providers: [GeoService]
})
export class GeoModule {}
