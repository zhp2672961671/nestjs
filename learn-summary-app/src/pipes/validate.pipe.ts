/*
PipeTransform<T, R> 是一个通用接口，其中 T 表示 value 的类型，R 表示 transform() 方法的返回类型
每个管道必须提供 transform() 方法。 这个方法有两个参数：
value
metadata
value 是当前处理的参数，而 metadata 是其元数据。元数据对象包含一些属性：
*/
import { PipeTransform, Injectable, ArgumentMetadata, Type, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
@Injectable()
export class ValidationPipe implements PipeTransform {
  // Nest 支持同步和异步管道。这样做的原因是因为有些 class-validator 的验证是可以异步的(Promise)
  // 正在使用解构赋值（从 ArgumentMetadata 中提取参数）到方法中。这是一个先获取全部 ArgumentMetadata 然后用附加语句提取某个变量的简写方式。
  async transform(value: any, { metatype }: ArgumentMetadata) {
    // toValidate() 方法。当验证类型不是 JavaScript 的数据类型时，跳过验证
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    /* 
    使用 class-transformer 的 plainToClass() 方法来转换 JavaScript 的参数为可验证的类型对象。
    一个请求中的 body 数据是不包含类型信息的，Class-validator 需要使用前面定义过的 DTO，就需要做一个类型转换。 */
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed');
    }
    return value;
  }
  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}

/*
这里有一些属性描述参数：

参数	描述
type	告诉我们该属性是一个 body @Body()，query @Query()，param @Param() 还是自定义参数 在这里阅读更多。
metatype	属性的元类型，例如 String。 如果在函数签名中省略类型声明，或者使用原生 JavaScript，则为 undefined。
data	传递给装饰器的字符串，例如 @Body('string')。 如果您将括号留空，则为 undefined。
!> TypeScript接口在编译期间消失，所以如果你使用接口而不是类，那么 metatype 的值将是一个 Object。 */
export interface ArgumentMetadata1 {
    type: 'body' | 'query' | 'param' | 'custom';
    metatype?: Type<unknown>;
    data?: string;
  }