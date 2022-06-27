import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Log4jsModule } from './log4js';

@Module({
  
  imports: [ Log4jsModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
