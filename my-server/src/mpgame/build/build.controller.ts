import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { BuildService } from './build.service';
import { JwtRolesGuard, Roles } from '../auth/guards/jwt.guard';
import { 
  CreateBuildDto, 
  ListBuildDto, 
  RemoveBuildDto, 
  WorkBuildDto, 
  FarmBuildDto,
  UpgradeBuildDto, 
  GetBuildDto, 
  BuildDataType, 
  MoveBuildDto, 
  OpenBuildDto,
  RepoBuildDto
} from './build.dto';

@ApiTags('建筑')
@Controller('api/build')
export class BuildController {
  constructor(
    private readonly service: BuildService,
  ) {}

  @UseGuards(JwtRolesGuard)
  @Roles('user')
  @ApiOperation({summary:'建筑一览'})
  @ApiHeader({name:'authoriation', description:'本次请求请带上token', required: true})
  @ApiResponse({description: '建筑数据列表', status:201, type: BuildDataType, isArray: true})
  @Post('listBuild')
  async listBuild(@Request() req: any, @Body() body: ListBuildDto): Promise<any> {
    return await this.service.listBuild(req.user, body);
  }

  @UseGuards(JwtRolesGuard)
  @Roles('user')
  @ApiOperation({summary:'获取建筑'})
  @ApiHeader({name:'authoriation', description:'本次请求请带上token', required: true})
  @ApiResponse({description: '建筑数据', status:201, type: BuildDataType})
  @Post('getBuild')
  async getBuild(@Request() req: any, @Body() body: GetBuildDto): Promise<any> {
    return await this.service.getBuild(req.user, body);
  }

  @UseGuards(JwtRolesGuard)
  @Roles('user')
  @ApiOperation({summary:'建造建筑'})
  @ApiHeader({name:'authoriation', description:'本次请求请带上token', required: true})
  @ApiResponse({description: '建筑数据', status:201, type: BuildDataType})
  @Post('createBuild')
  async createBuild(@Request() req: any, @Body() body: CreateBuildDto): Promise<any> {
    return await this.service.createBuild(req.user, body);
  }

  @UseGuards(JwtRolesGuard)
  @Roles('user')
  @ApiOperation({summary:'拆除建筑'})
  @ApiHeader({name:'authoriation', description:'本次请求请带上token', required: true})
  @ApiResponse({description: JSON.stringify({affected:"拆除的数量"}), status:201})
  @Post('removeBuild')
  async removeBuild(@Request() req: any, @Body() body: RemoveBuildDto): Promise<any> {
    return await this.service.removeBuild(req.user, body);
  }

  @UseGuards(JwtRolesGuard)
  @Roles('user')
  @ApiOperation({summary:'建筑工作'})
  @ApiHeader({name:'authoriation', description:'本次请求请带上token', required: true})
  @Post('workBuild')
  async workBuild(@Request() req: any, @Body() body: WorkBuildDto): Promise<any> {
    return await this.service.workBuild(req.user, body);
  }

  @UseGuards(JwtRolesGuard)
  @Roles('user')
  @ApiOperation({summary:'建筑收获'})
  @ApiHeader({name:'authoriation', description:'本次请求请带上token', required: true})
  @Post('farmBuild')
  async farmBuild(@Request() req: any, @Body() body: FarmBuildDto): Promise<any> {
    return await this.service.farmBuild(req.user, body);
  }

  @UseGuards(JwtRolesGuard)
  @Roles('user')
  @ApiOperation({summary:'升级建筑'})
  @ApiHeader({name:'authoriation', description:'本次请求请带上token', required: true})
  @ApiResponse({description: '建筑数据', status:201, type: BuildDataType})
  @Post('upgradeBuild')
  async upgradeBuild(@Request() req: any, @Body() body: UpgradeBuildDto): Promise<any> {
    return await this.service.upgradeBuild(req.user, body);
  }

  @UseGuards(JwtRolesGuard)
  @Roles('user')
  @ApiOperation({summary:'移动建筑'})
  @ApiHeader({name:'authoriation', description:'本次请求请带上token', required: true})
  @ApiResponse({description: '建筑数据', status:201, type: BuildDataType})
  @Post('moveBuild')
  async moveBuild(@Request() req: any, @Body() body: MoveBuildDto):  Promise<any> {
    return await this.service.moveBuild(req.user, body);
  }

  @UseGuards(JwtRolesGuard)
  @Roles('user')
  @ApiOperation({summary:'打开建筑'})
  @ApiHeader({name:'authoriation', description:'本次请求请带上token', required: true})
  @ApiResponse({description: '建筑数据', status:201, type: BuildDataType})
  @Post('openBuild')
  async openBuild(@Request() req: any, @Body() body: OpenBuildDto):  Promise<any> {
    return await this.service.openBuild(req.user, body);
  }

  @UseGuards(JwtRolesGuard)
  @Roles('user')
  @ApiOperation({summary:'存放资源'})
  @ApiHeader({name:'authoriation', description:'本次请求请带上token', required: true})
  @ApiResponse({description: '建筑数据', status:201, type: BuildDataType})
  @Post('repoBuild')
  async repoBuild(@Request() req: any, @Body() body: RepoBuildDto):  Promise<any> {
    return await this.service.repoBuild(req.user, body);
  }

  @UseGuards(JwtRolesGuard)
  @Roles('user')
  @ApiOperation({summary:'获取服务器时间戳,单位(秒)'})
  @ApiHeader({name:'authoriation', description:'本次请求请带上token', required: true})
  @ApiResponse({description: JSON.stringify({data:"以秒为单位的时间戳"}), status:201 })
  @Post('getTimestamp')
  async getTimestamp(): Promise<any> {
    return await this.service.getTimestamp();
  }
}
