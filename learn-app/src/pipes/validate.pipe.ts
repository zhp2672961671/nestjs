/*
PipeTransform<T, R> 是一个通用接口，其中 T 表示 value 的类型，R 表示 transform() 方法的返回类型
每个管道必须提供 transform() 方法。 这个方法有两个参数：
value
metadata
value 是当前处理的参数，而 metadata 是其元数据。元数据对象包含一些属性：
*/
import { PipeTransform, Injectable, ArgumentMetadata, Type } from '@nestjs/common';
@Injectable()
export class ValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    return value;
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