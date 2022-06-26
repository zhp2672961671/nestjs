import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsService } from './providers/cats.service';

const mockCatsService = {
  /* mock implementation
  ...
  */
};
/* 使用 CatsService 类名称作为令牌。 对于任何依赖 CatsService 的类，Nest 都会注入提供的类的实例（ AppService 
或 CatsService），该实例将覆盖在其他地方已声明的任何默认实现（例如，使用 @Injectable() 装饰器声明的 CatsService

 */
const configServiceProvider = {
  provide: CatsService,
  useClass:
    process.env.NODE_ENV === 'development'
      ? AppService
      : CatsService,
};

@Module({
  imports: [],
  controllers: [AppController],
  // providers: [AppService,CatsService],


 /* 
 标准提供者
 providers属性接受一个提供者数组。到目前为止，我们已经通过一个类名列表提供了这些提供者。
  实际上，该语法providers: [CatsService]是更完整语法的简写：
  我们看到了这个显式的构造，我们可以理解注册过程。在这里，我们明确地将令牌 CatsService与类 CatsService 关联起来。
  简写表示法只是为了简化最常见的用例，其中令牌用于请求同名类的实例。 */

  // providers: [
  //   {
  //     provide: CatsService,
  //     useClass: CatsService,
  //   },
  // ]
  /* 
  自定义提供者 */

  /* 值提供者 (useValue)
  useValue 语法对于注入常量值、将外部库放入 Nest 容器或使用模拟对象替换实际实现非常有用。
  CatsService 令牌将解析为 mockCatsService 模拟对象。useValue 需要一个值——在本例中是一个文字对象，
  它与要替换的 CatsService 类具有相同的接口。由于 TypeScript 的结构类型化，您可以使用任何具有兼容接口的对象，
  包括文本对象或用 new 实例化的类实例。


   */

  // providers: [
  //   {
  //     provide: CatsService,
  //     useValue: mockCatsService,
  //   },
  // ],

  /* 非类提供者
  我们可能希望灵活使用字符串或符号作为 DI
   */

  // providers: [
  //   {
  //     provide: 'CatsService',
  //     useValue: CatsService,
  //   },
  // ],

  /* 类提供者 (useClass) 
  useClass语法允许您动态确定令牌应解析为的类。 例如，假设我们有一个抽象（或默认）的 ConfigService 类。
   根据当前环境，我们希望 `Nest 提供配置服务的不同实现
   定义对象 configServiceProvider，然后将其传递给模块装饰器的 providers 属性。
  */

   providers: [configServiceProvider],


   /* 
   工厂提供者 (useFactory)
useFactory 语法允许动态创建提供程序。实工厂函数的返回实际的 provider 。工厂功能可以根据需要简单或复杂。
一个简单的工厂可能不依赖于任何其他的提供者。更复杂的工厂可以自己注入它需要的其他提供者来计算结果。对于后一种情况，工厂提供程序语法有一对相关的机制:
工厂函数可以接受(可选)参数。
inject 属性接受一个提供者数组，在实例化过程中，Nest 将解析该数组并将其作为参数传递给工厂函数。这两个列表应该是相关的:
 Nest 将从 inject 列表中以相同的顺序将实例作为参数传递给工厂函数。
 const connectionFactory = {
  provide: 'CONNECTION',
  useFactory: (optionsProvider: OptionsProvider) => {
    const options = optionsProvider.get();
    return new DatabaseConnection(options);
  },
  inject: [OptionsProvider],
@Module({
  providers: [connectionFactory],
})
};

   */


  
})

export class AppModule {}
