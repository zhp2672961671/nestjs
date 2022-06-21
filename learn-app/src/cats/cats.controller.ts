import { Controller, Get, Post, Body, HttpException, HttpStatus, UseFilters } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { CatsService } from './cats.service';
import { Cat } from './interfaces/cat.interface';
import { ForbiddenException } from 'src/filters/forbidden.exception';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';

@Controller('cats')
// 要将过滤器设置为控制器作用域
@UseFilters(new HttpExceptionFilter())
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


}
