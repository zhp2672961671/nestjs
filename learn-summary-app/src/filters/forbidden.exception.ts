import { HttpException, HttpStatus } from "@nestjs/common";
/* 
自定义异常 
在许多情况下，您无需编写自定义异常，而可以使用内置的 Nest HTTP异常，如下一节所述。
 如果确实需要创建自定义的异常，则最好创建自己的异常层次结构，其中自定义异常从基 HttpException 类继承。
  使用这种方法，Nest可以识别您的异常，并自动处理错误响应。 让我们实现这样一个自定义异常：
*/
// 由于 ForbiddenException 扩展了基础 HttpException，它将和核心异常处理程序一起工作，因此我们可以在 findAll()方法中使用它。
export class ForbiddenException extends HttpException {
    constructor() {
      super('Forbidden', HttpStatus.FORBIDDEN);
    }
  }