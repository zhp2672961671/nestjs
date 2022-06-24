import { Controller, Get, Post, Body, HttpException, HttpStatus, UseFilters, UsePipes, Param, UseGuards, SetMetadata, UseInterceptors } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { CatsService } from './cats.service';
import { Cat } from './interfaces/cat.interface';
import { ForbiddenException } from 'src/filters/forbidden.exception';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';
import { JoiValidationPipe } from 'src/pipes/joiValidation.pipe';
import { ObjectSchema } from '@hapi/joi';
import { ValidationPipe } from 'src/pipes/validate.pipe';
import { ParseIntPipe } from 'src/pipes/parse-int.pipe';
import { RolesGuard } from 'src/guards/roles.guard';
import { LoggingInterceptor } from 'src/Interceptors/logging.interceptor';
import { User } from 'src/decorator/user.decorator';
let createCatSchema:ObjectSchema;

@Controller('cats')
/*
绑定守卫
可以传类型RolesGuard 也可以传实例new RolesGuard()
构造将守卫附加到此控制器声明的每个处理程序
 */
@UseGuards(RolesGuard)

// 要将过滤器设置为控制器作用域
@UseFilters(new HttpExceptionFilter())
// 控制器范围内设置拦截器
// 传递的是 LoggingInterceptor 类型而不是实例，让框架承担实例化责任并启用依赖注入
@UseInterceptors(LoggingInterceptor)
// 传递立即创建的实例 设置拦截器
@UseInterceptors(new LoggingInterceptor())
export class CatsController {
  constructor(private catsService: CatsService) {}

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }
//   Nest提供了一个内置的 HttpException 类，它从 @nestjs/common 包中导入。对于典型的基于HTTP REST/GraphQL API的应用程序，最佳实践是在发生某些错误情况时发送标准HTTP响应对象。
// 在 CatsController，我们有一个 findAll() 方法（GET 路由）。假设此路由处理程序由于某种原因引发异常。 为了说明这一点，我们将对其进行如下硬编码：
@Get()
async findAll0() {

//   HttpException 构造函数有两个必要的参数来决定响应:
// response 参数定义 JSON 响应体。它可以是 string 或 object，如下所述。
// status参数定义HTTP状态代码。
// 默认情况下，JSON 响应主体包含两个属性：
// statusCode：默认为 status 参数中提供的 HTTP 状态代码
// message:基于状态的 HTTP 错误的简短描述
// 仅覆盖 JSON 响应主体的消息部分，请在 response参数中提供一个 string。
// 要覆盖整个 JSON 响应主体，请在response 参数中传递一个object。 Nest将序列化对象，并将其作为JSON 响应返回。
// 第二个构造函数参数-status-是有效的 HTTP 状态代码。 最佳实践是使用从@nestjs/common导入的 HttpStatus枚举。

  throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
}

// 现在当客户端调用这个端点时，响应如下所示：
// {
//     "statusCode": 403,
//     "message": "Forbidden"
// }

// 使用上面的代码，响应如下所示：

// {
//   "status": 403,
//   "error": "This is a custom message"
// }

@Get()
async findAll1() {
  throw new HttpException({
    status: HttpStatus.FORBIDDEN,
    error: 'This is a custom message',
  }, HttpStatus.FORBIDDEN);
}

// 由于 ForbiddenException 扩展了基础 HttpException，它将和核心异常处理程序一起工作，因此我们可以在 findAll()方法中使用它。
@Get()
async findAll2() {
  throw new ForbiddenException();
}
// HttpExceptionFilter 绑定到 CatsController 的 create() 方法上。
@Post()
/*
我们在这里使用了 @UseFilters() 装饰器。和 @Catch()装饰器类似，它可以使用单个过滤器实例，也可以使用逗号分隔的过滤器实例列表。
 我们创建了 HttpExceptionFilter 的实例。另一种可用的方式是传递类（不是实例），让框架承担实例化责任并启用依赖注入。 */
@UseFilters(new HttpExceptionFilter())
async create1(@Body() createCatDto: CreateCatDto) {
  throw new ForbiddenException();
}
@Post()
// 可用的方式是传递类（不是实例）
@UseFilters(HttpExceptionFilter)
async create2(@Body() createCatDto: CreateCatDto) {
  throw new ForbiddenException();
}
/*
我们要确保create方法能正确执行，所以必须验证 CreateCatDto 里的三个属性。我们可以在路由处理程序方法中做到这一点，但是我们会打破单个责任原则（SRP）。
另一种方法是创建一个验证器类并在那里委托任务，但是不得不每次在方法开始的时候我们都必须使用这个验证器。那么验证中间件呢？ 这可能是一个好主意，
但我们不可能创建一个整个应用程序通用的中间件(因为中间件不知道 execution context执行环境,也不知道要调用的函数和它的参数)。

在这种情况下，你应该考虑使用管道。 */
@Post()
async create3(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
/* 使用 @UsePipes() 装饰器并创建一个管道实例，并将其传递给 Joi 验证。 */
@Post()
@UsePipes(new JoiValidationPipe(createCatSchema))
async create4(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
@Post()
/* 设置 ValidationPipe 。管道，与异常过滤器相同，它们可以是方法范围的、控制器范围的和全局范围的。
另外，管道可以是参数范围的。我们可以直接将管道实例绑定到路由参数装饰器，例如@Body()
当验证逻辑仅涉及一个指定的参数时，参数范围的管道非常有用*/
async create5(@Body(new ValidationPipe()) createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
@Post()
// 要在方法级别设置管道，您需要使用 UsePipes() 装饰器。
@UsePipes(new ValidationPipe())
async create6(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
// 上面的例子中 ValidationPipe 的实例已就地立即创建。另一种可用的方法是直接传入类（而不是实例），让框架承担实例化责任，并启用依赖注入。
@Post()
@UsePipes(ValidationPipe)
async create7(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}

@Post()
/*
通过 @SetMetadata() 装饰器将定制元数据附加到路由处理程序的能力。
这些元数据提供了我们所缺少的角色数据，而守卫需要这些数据来做出决策。
将 roles 元数据(roles 是一个键，而 ['admin'] 是一个特定的值)附加到 create() 方法。
*/
@SetMetadata('roles', ['admin'])
async create8(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}

/*
使用自定义的 @Roles() 装饰器
更简洁、更易读，而且是强类型的
*/
@Post()
@Roles('admin')
async create9(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}


@Get(':id')
async findOne(@Param('id', new ParseIntPipe()) id) {
  return await this.catsService.findOne(id);
}
/*
按 ID 从数据库中选择一个现有的用户实体。
 */
// @Get(':id')
// async findOne(@Param('id', new ParseUUIDPipe()) id) {
//   return await this.catsService.findOne(id);
// }

/*
ParseUUIDPipe 管道, 它用来分析验证字符串是否是 UUID.
 */
// @Get(':id')
// async findOne(@Param('id', new ParseUUIDPipe()) id) {
//   return await this.catsService.findOne(id);
// }

/*
做一个管道自己通过 id 找到实体数据:
*/
// @Get(':id')
// findOne(@Param('id', UserByIdPipe) userEntity: UserEntity) {
//   return userEntity;
// }


// @Get()
// async findOne1(@User() user: UserEntity) {
//   console.log(user);
// }

@Get()
async findOne3(@User('firstName') firstName: string) {
  console.log(`Hello ${firstName}`);
}
}

// 定义的 @Roles() 装饰器
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
