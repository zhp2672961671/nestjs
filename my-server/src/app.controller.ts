import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { AppService } from './app.service';
export class CreateCatDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  age: number;
  @ApiProperty()
  breed: string;
}
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Post()
  async create1(@Body() createCatDto: CreateCatDto) {
    // this.catsService.create(createCatDto);
    return createCatDto.name;
  }

}

