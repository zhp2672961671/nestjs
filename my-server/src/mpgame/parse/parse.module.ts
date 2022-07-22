import { Module } from '@nestjs/common';
import { ParseController } from './parse.controller';

@Module({
  controllers: [ParseController]
})
export class ParseModule {}
