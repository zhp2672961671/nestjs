// https://www.kancloud.cn/juukee/nestjs/2676785
import { BadRequestException, Controller, Get, Post, UploadedFile, UploadedFiles, UseInterceptors, StreamableFile, Res, Body } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Express } from 'express';
import { join } from 'path';
import { createWriteStream, createReadStream, statSync, readdirSync, unlinkSync, existsSync } from 'fs';
import { parseXlsxs } from 'src/app.utils';

const pathIn = "../../../data/in";
const pathOut = "../../../data/out";

@ApiTags('配置文件解析')
@Controller('api/parse')
export class ParseController {
  /**
   * 上传单个文件并解析
   */
  @ApiOperation({ summary: '单个上传文件' })
  @Post('upload-file')
  /*
  FileInterceptor() 接收两个参数：
  一个 fieldName (指向包含文件的 HTML 表单的字段)
  可选 options 对象
  */
  @UseInterceptors(FileInterceptor('file'))
  // Multer 处理以 multipart/form-data 格式发送的数据 Multer无法处理不是受支持的多部分格式（multipart/form-data）的数据。
  uploadFile(@UploadedFile() file: Express.Multer.File, @Res() res:any) {
    // originalname用户计算机上的文件的名称
    const ext = file.originalname.split('.');
    if(ext.length < 2) return '文件名不对';
    if(ext[ext.length-1] !== 'xlsx') return '上传文件必须是xlsx格式';

    // 文件名+目录
    const fileName = join(__dirname, pathIn, `${file.originalname}`);
    // 创建WriteStream 一个可写流。
    const wf = createWriteStream(fileName);
    // buffer一个存放了整个文件的 Buffer
    wf.write(file.buffer, (err)=> {
      if(err) throw new BadRequestException();
      return res.send('上传完毕, 待打包成JSON');
    });
  }

  /**
   * 批量上传
   */
  @ApiOperation({ summary: '批量上传文件' })
  @Post('upload-files')
  @UseInterceptors(FilesInterceptor('files'))
  uploadedFiles(@UploadedFiles() files: Array<Express.Multer.File>, @Res() res: any) {
    // 完成计数器
    let completeCnt = 0;
    // 批量
    files.forEach(element => {
      // 校验一波文件名
      const ext = element.originalname.split('.');
      if(ext.length < 2) return res.send(`${element.originalname} 不符合要求`);
      if(ext[ext.length-1] !== 'xlsx') return res.send(`${element.originalname} 必须是xlsx格式`);

      // 文件名+目录
      const fileName = join(__dirname, pathIn, `${element.originalname}`);
      const wf = createWriteStream(fileName);

      // 写入指定目录
      wf.write(element.buffer, (err)=> {
        if(err) throw new BadRequestException();
        completeCnt ++;
        if(completeCnt === files.length) return res.send('上传完毕, 待打包成JSON');
      });
    });
  }


  /**
   * 打包
   */
  @ApiOperation({ summary: '打包所有xlsx' })
  @Post('package')
  package(@Res() res: any) {
    // 写入路径
    const path = join(__dirname, pathIn);

    // 读取原路径，检查目录情况才好正常操作遍历文件
    // 返回一个 fs.Stats 实例。
    const stat = statSync(path);
    if(!stat.isDirectory()) return res.send('文件目录异常');

    let result = {};
    // 返回一个不包括 '.' 和 '..' 的文件名的数组。
    let fileNames = readdirSync(path);
    let completeCnt = 0;
    let outPath = join(__dirname, pathOut, 'result.json');

    // 先删除文件0
    //existsSync 如果路径存在，则返回 true，否则返回 false。
    if(existsSync(outPath)) unlinkSync(outPath);

    // 检查文件个数
    if(fileNames.length === 0) return res.send('目录不存在文件');

    // 遍历
    fileNames.forEach(item => {
      let fileName = path + "/" + item;
      // 更新递归调用
      console.log("parseXlsxs========",fileName)
      parseXlsxs(fileName, result);
      // 计数器
      completeCnt ++;
      // 完成目标
      console.log("parseXlsxs========end")
      if(completeCnt === fileNames.length) {
        // 创建写入流
        const ws = createWriteStream(outPath);
        ws.write(JSON.stringify(result), err => {
          if(err) throw new BadRequestException();
          return res.send('打包完成,可访问检查');
        });
      }
    });
  }

  /**
   * 删除指定文件
   */
  @ApiOperation({ summary: "删除文件" })
  @Post('delete-files')
  deleteFiles(@Body() body:any, @Res() res:any) {
    // 校验参数
    if(!body.files) return res.send('没有指定文件名');
    let removeArr = body.files.split(",");

    // 读取原路径，检查目录情况才好正常操作遍历文件
    const path = join(__dirname, pathIn);
    const stat = statSync(path);
    if(!stat.isDirectory()) return res.send('文件目录异常');

    // 递归调用
    let fileNames = readdirSync(path);
    fileNames.forEach(item => {
      if (removeArr.indexOf(item.split(".")[0]) > -1) {
        // 删除文件 ${}获取变量 要在 ` `中使用
        unlinkSync(`${path}/${item}`);
      }
    });

    return res.send('删除文件完毕，请重新打包');
  }

  /**
   * 接口获取生成的接口
   */
  @ApiOperation({ summary: '获取result.json' })
  @Get('result')
  result(@Res({passthrough:true}) res:any): StreamableFile {
    const fileName = join(__dirname, pathOut, 'result.json');
    const file = createReadStream(fileName);
    // 自定义响应类型
    res.set({
      'Content-Type': 'application/json',
    });
    // StreamableFile是一个持有要返回的流的类。你可以传入一个Buffer或者Stream到StreamableFile类的构造函数来创建一个新的StreamableFile实例。
    return new StreamableFile(file);
  }
}
