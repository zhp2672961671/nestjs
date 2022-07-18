import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';
import { GeoService } from './geo.service';
import { GetGeoDto, SyncGeoDto, ChangeGeoDto, ResetGeoDto } from './geo.dto';
import { JwtRolesGuard, Roles } from '../auth/guards/jwt.guard';

@ApiTags('地形')
@Controller('api/geo')
export class GeoController {
  constructor(
    private readonly service: GeoService,
  ) {}

  @ApiOperation({summary: '获取地形' })
  @ApiHeader({name:'authoriation', description:'本次请求请带上token', required: true})
  @Post('getGeo')
  @UseGuards(JwtRolesGuard)
  @Roles('user')
  async getGeo(@Request() req: any, @Body() body: GetGeoDto): Promise<any> {
    return await this.service.getList(req.user, body);
  }

  @ApiOperation({summary: '同步地形' })
  @ApiHeader({name:'authoriation', description:'本次请求请带上token', required: true})
  @Post('syncGeo') 
  @UseGuards(JwtRolesGuard)
  @Roles('user')
  async syncGeo(@Request() req: any, @Body() body: SyncGeoDto): Promise<any> {
    return await this.service.syncList(req.user, body);
  }

  @ApiOperation({summary: '改变指定单元格地形' })
  @ApiHeader({name:'authoriation', description:'本次请求请带上token', required: true})
  @Post('changeGeo') 
  @UseGuards(JwtRolesGuard)
  @Roles('user')
  async changeGeo(@Request() req: any, @Body() body:ChangeGeoDto): Promise<any> {
    return await this.service.changeGeography(req.user, body);
  }

  @ApiOperation({summary: '复位地形（重新随机一次）' })
  @ApiHeader({name:'authoriation', description:'本次请求请带上token', required: true})
  @Post('resetGeo') 
  @UseGuards(JwtRolesGuard)
  @Roles('user')
  async resetGeo(@Request() req: any, @Body() body:ResetGeoDto): Promise<any> {
    return await this.service.resetList(req.user, body);
  }
}
