import { Controller, Post, Get, Body, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JobService } from '../job/job.service';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';
import { JwtRolesGuard, Roles } from '../auth/guards/jwt.guard';
import { CreateUserDto, PayUserDto, CheckOrderDto } from './users.dto';


@ApiTags('用户')
@Controller('api/users')
export class UsersController {
  // 服务注入
  constructor(
    private readonly usersService: UsersService,
    private readonly job: JobService,
  ) {}

  // 列表星球
  @UseGuards(JwtRolesGuard)
  @Roles('user')
  @ApiOperation({ summary: '列表星球' })
  @ApiHeader({name:'authoriation', description:'本次请求请带上token', required: true})
  @Post('listSphere')
  async listSphere(@Request() req: any): Promise<any> {
    return await this.job.listSphere({address: req.user.address});
  }

  // 查询订单
  // @UseGuards(JwtRolesGuard)
  // @Roles('user')
  // @ApiOperation({ summary: '查询订单' })
  // @ApiHeader({name:'authoriation', description:'本次请求请带上token', required: true})
  // @Post('checkOrder')
  // async checkOrder(@Request() req: any, @Body() body: CheckOrderDto): Promise<any> {
  //   return await this.job.checkOrder({
  //     address: req.user.address,
  //     orderIndex: body.orderIndex,
  //   });
  // }

  // 列表订单
  // @UseGuards(JwtRolesGuard)
  // @Roles('user')
  // @ApiOperation({ summary: '列表订单' })
  // @ApiHeader({name:'authoriation', description:'本次请求请带上token', required: true})
  // @Post('listOrder')
  // async listOrder(@Request() req: any): Promise<any> {
  //   return await this.job.listOrder({address: req.user.address});
  // }

  // 获取用户信息
  @UseGuards(JwtRolesGuard)
  @Post('profile')
  @Roles('user')
  @ApiOperation({ summary: '获取用户信息' })
  @ApiHeader({name:'authoriation', description:'本次请求请带上token', required: true})
  async getProfile(@Request() req: any): Promise<any> {
    return await this.usersService.update(req.user);
  }

  // 增加用户
  // @UseGuards(JwtRolesGuard)
  // @Post('create')
  // @Roles('admin')
  // @ApiOperation({ summary: '添加用户,身份[管理]' })
  // @ApiHeader({name:'authoriation', description:'本次请求请带上token', required: true})
  // async create(@Body() body:CreateUserDto): Promise<any> {
  //   return {
  //     errCode: 0,
  //     errMsg: 'success',
  //     data: await this.usersService.create(body.address),
  //   }
  // }

  // 创建收款账户
  // @UseGuards(JwtRolesGuard)
  // @Post('pay')
  // @Roles('user')
  // @ApiOperation({ summary: '充值,身份[用户]' })
  // @ApiHeader({name:'authoriation', description:'本次请求请带上token', required: true})
  // async pay(@Request() req: any, @Body() body: PayUserDto): Promise<any> {
  //   return await this.usersService.pay({
  //     user: req.user,
  //     ...body
  //   });
  // }

  // // 删除用户
  // @Delete()
  // @ApiOperation({ summary: '删除用户' })
  // async delete(@Body() removeUserDto: RemoveUserDto): Promise<any> {
  //   return await this.usersService.remove(removeUserDto);
  // }

  // // 更新用户
  // @Put(':id')
  // @ApiOperation({ summary: '更新' })
  // async update(
  //   @Param() params: RetrieveUserDto,
  //   @Body() updateUserDto: UpdateUserDto,
  // ): Promise<any> {
  //   return await this.usersService.update({
  //     id: params.id,
  //     updateUserDto,
  //   });
  // }

  // // 列表用户
  // @Get()
  // @ApiOperation({ summary: '列表' })
  // async findAll(@Query() findUserDto: FindUserDto): Promise<User> {
  //   return await this.usersService.findAll(findUserDto);
  // }

  // // 根据id查找
  // @Get(':id')
  // @ApiOperation({ summary: '根据 id 查找' })
  // async findOneById(@Param() params: RetrieveUserDto): Promise<any> {
  //   return await this.usersService.findOneById(params.id);
  // }

  // // 根据id更新密码
  // @Put('password/:id')
  // @ApiOperation({ summary: '更新密码' })
  // async updatePassword(
  //   @Param() params: RetrieveUserDto,
  //   @Body() updateUserPasswordDto: UpdateUserPasswordDto,
  // ): Promise<any> {
  //   return await this.usersService.updatePassword({
  //     id: params.id,
  //     body: updateUserPasswordDto,
  //   });
  // }

  // // 根据id重置密码
  // @Put('password/reset/:id')
  // @ApiOperation({ summary: '重置密码' })
  // async resetPassword(@Param() params: RetrieveUserDto): Promise<any> {
  //   return await this.usersService.resetPassword(params);
  // }

  // // 根据id设置头像
  // @Put('avatar/:id')
  // @ApiOperation({ summary: '设置头像' })
  // async updateAvatar(
  //   @Param() params: RetrieveUserDto,
  //   @Body() updateUserAvatarDto: UpdateUserAvatarDto,
  // ): Promise<any> {
  //   return await this.usersService.updateAvatar({
  //     id: params.id,
  //     updateUserAvatarDto,
  //   });
  // }

  // // 数量
  // @Get('list/count')
  // @ApiOperation({ summary: '用户数量' })
  // async getCount() {
  //   return await this.usersService.getCount();
  // }
}
