import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { JobModule } from '../job/job.module';

@Module({
  imports: [TypeOrmModule.forFeature([
    User,
  ]), JobModule],
  exports: [UsersService],
  providers: [
    UsersService,
  ],
  controllers: [UsersController],
})
export class UsersModule {}
