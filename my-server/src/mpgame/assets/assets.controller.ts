import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';
import { JwtRolesGuard, Roles } from '../auth/guards/jwt.guard';
import { ListAssetsDto } from './assets.dto';

@ApiTags('用户资产')
@Controller('api/assets')
export class AssetsController {
  constructor(
    private readonly assetsService: AssetsService
  ) {}

  @UseGuards(JwtRolesGuard)
  @Roles('user')
  @ApiOperation({summary: '获取资产' })
  @ApiHeader({name:'authoriation', description:'本次请求请带上token', required: true})
  @Post('listAssets')
  async listAssets(@Req() req: any, @Body() body: ListAssetsDto): Promise<any> {
    return await this.assetsService.listAssets(req.user, body);
  }
}
