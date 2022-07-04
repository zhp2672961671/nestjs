// 内置的crypto模块可用于加密和解密字符串，数字，Buffer，流等等
import { createHmac } from 'crypto';
import { CryptoConstants } from './app.config';
import * as fs from 'fs';
import * as path from 'path';
import xlsx from 'node-xlsx';
// https://learnblockchain.cn/docs/ethers.js/
// https://docs.ethers.io/v5/api/utils/bignumber/
import { BigNumber, ethers } from 'ethers';

/**
 * 用本地私钥导出加密方法
 * @returns 加密串
 */
/*
crypto.createHmac()方法用于创建使用规定的“算法”和“ key ”的Hmac对象。
此方法接受avobe所述的三个参数，如下所述：
algorithm:它取决于平台上的OpenSSL版本所支持的可访问算法。它返回字符串。示例是sha256，sha512等。
key:这是HMAC key ，用于创建加密的HMAC哈希。它返回字符串，Buffer，TypedArray，DataView或KeyObject。如果它是KeyObject，则其类型必须是秘密的。
options:它是可选参数，用于控制流的行为。它返回一个对象。
返回类型：它返回Hmac对象
*/
export const cryptoString = (str: string) => {
  return createHmac('sha256', CryptoConstants.PRIVATE_KEY)
  /*
  update(data, [encoding]);p
在如上面的方法，该方法须要使用两个参数，第一个参数是必选项，该参数值是一个Buffer对象或一个字符串，用于指定摘要内容
 第二个参数 encoding用于指定摘要内容所需使用的编码格式，能够指定为 'utf-8', 'ascii', 或 'binary'. 若是不使用第二个参数，
 则第一个参数data参数值必须为一个Buffer对象，咱们也能够在摘要被输出前使用屡次updata方法来添加摘要内容。优 */
    .update(str)
    /*
    hash.digest([encoding]);
    该方法有一个参数，该参数是一个可选值，表示的意思是 用于指定输出摘要的编码格式，可指定参数值为 'hex', 'binary',
    及 'base64'.若是使用了该参数，那么digest方法返回字符串格式的摘要内容，若是不使用该参数，那么digest方法返回一个是Buffer对象。 */
    .digest('hex');
};

/**
 * 获取服务器时间戳，单位s
 */
export const now = () => {
  return parseInt((Date.now() / 1000).toString());
}

/**
 * 获取指定ABI
 * 存放路径为/data/abi
 */
export const abiFromJson = (jsonFile: string) => {
  // path.join()方法是将多个参数字符串合并成一个路径字符串
  const filepath = path.join(__dirname, '../data/abi', jsonFile);
  const jsonObj = JSON.parse((fs.readFileSync(filepath)) as any);
  return jsonObj.abi;
}

/**
 * 获取指定配置
 * 存放路径为/data/conf
 */
export const confFromJson = (jsonFile: string) => {
  const filepath = path.join(__dirname, '../data/config', jsonFile);
  const jsonObj = JSON.parse((fs.readFileSync(filepath)) as any);
  return jsonObj;
}

/**
 * 解析setid
 * ex组成 1_1004_1004_1004
 */
export const parseSetId = (setId: BigNumber) => {
  // from返回aBigNumberish的BigNumber实例。
  /*
  let a = BigNumber.from(42);
let b = BigNumber.from("91");
a.mul(b);
// { BigNumber: "3822" } */
  const F6 = BigNumber.from(0xFFFFFF);
  const F4 = BigNumber.from(0xFFFF);
  const F2 = BigNumber.from(0xFF);

  // 拆出PartId
  let partIds = [];
  for(let i=3; i >= 0; i--){
    let partId = setId.shr(i * 24).and(F6)
    partIds.push(partId);
  }

  // 解析每个PartId
  let results = [];
  for(let partId of partIds) {
    let pType = partId.shr(16).and(F2);
    let pNum = partId.and(F4);
    results.push({ pType, pNum });
  }

  // 转化输出
  let v1 = ethers.utils.formatUnits(results[0].pNum, 0);
  let v2 = ethers.utils.formatUnits(results[1].pNum, 0);
  let v3 = ethers.utils.formatUnits(results[2].pNum, 0);
  let v4 = ethers.utils.formatUnits(results[3].pNum, 0);
  return `${v1}_${v2}_${v3}_${v4}`;
}

/**
 * 获取单部件
 */
 export const parsePartFormSetId = (setId: BigNumber, partType: number) => {
  const F6 = BigNumber.from(0xFFFFFF);
  const F4 = BigNumber.from(0xFFFF);
  const F2 = BigNumber.from(0xFF);

  // 拆出PartId
  let partIds = [];
  for(let i=3; i >= 0; i--){
    let partId = setId.shr(i * 24).and(F6)
    partIds.push(partId);
  }

  // 解析每个PartId
  let results = [];
  for(let partId of partIds) {
    let pType = partId.shr(16).and(F2);
    let pNum = partId.and(F4);
    results.push({ pType, pNum });
  }

  // 转化输出
  /*
  formatUnits
  将 wei 单位数格式化为一个代表某单位数的十进制字符串。 输出值总是包含至少一个整数和一个小数位，否则将修剪前导和尾随的 0。
   参数 decimalsOrUnitsName 可以是 3 到 18 之间（3 的倍数）的小数位数， 或者是单位名称， */
  let v1 = ethers.utils.formatUnits(results[0].pNum, 0);
  let v2 = ethers.utils.formatUnits(results[1].pNum, 0);
  let v3 = ethers.utils.formatUnits(results[2].pNum, 0);
  let v4 = ethers.utils.formatUnits(results[3].pNum, 0);
// toHexString返回值的十六进制字符串表示。
  let part1 = "0x" + results[0].pNum.toHexString().split('0x')[1];
  let part2 = "0x01" + results[1].pNum.toHexString().split('0x')[1];
  let part3 = "0x02" + results[2].pNum.toHexString().split('0x')[1];
  let part4 = "0x03" + results[3].pNum.toHexString().split('0x')[1];

  switch(partType) {
  case 0:
    return { trait_type:'Base', value: v1, partId: part1 }
  case 1:
    return { trait_type:'Hair', value: v2, partId: part2 }
  case 2:
    return { trait_type:'Head', value: v3, partId: part3 }
  case 3:
    return { trait_type:'Cloth', value: v4, partId: part4 }
  }
}

/**
 * 获取地址
 */
export const getImgUrl = (name: string, ext: string = '.png' ) => {
  if(process.env.IMG_PATH) {
    return process.env.IMG_PATH + name + ext;
  }
  return name + ext;
}

/**
 * 解析指定xlsx
 */
export const parseXlsx = (fileName: string) => {
  // 读取Excel文件，并解析
  let list = xlsx.parse(fileName);
  let result = {};
  for (let i = 0; i < list.length; i++) {
    let item = list[i];
    let excelName = item.name;
    let excelObj = {};
    let keys = item.data[3];//键名

    // 对于不同的表格 最后一行可能为空 做下特殊处理
    // fixed by mazili on 20220419
    // let totalLength = item.data.length;
    // let lastLineValue: any = item.data[totalLength - 1];
    // let maxLine = (lastLineValue.length === 0) ? (totalLength - 1) : totalLength;

    for (let j = 6; j < item.data.length; j++) {
      let values:any = item.data[j];//values,
      let childObjKey = values[1];
      let emptyObj = {};

      // fixed by mazili on 20220520
      if(values.length === 0) continue;

      for (let k = 1; k < values.length; k++) {
        emptyObj[keys[k]] = values[k];
      }
      excelObj[childObjKey] = emptyObj;
    }
    result[excelName] = excelObj;
  }
  return result;
}

/**
 * 附加解析xlsx
 */
export const parseXlsxs = (fileName: string, result: any) => {
  let list = xlsx.parse(fileName);
  for (let i = 0; i < list.length; i++) {
    let item = list[i];
    let excelName = item.name;

    let excelObj = {};
    let keys = item.data[3];//键名

    // 对于不同的表格 最后一行可能为空 做下特殊处理
    // fixed by mazili on 20220419
    // let totalLength = item.data.length;
    // let lastLineValue: any = item.data[totalLength - 1];
    // let maxLine = (lastLineValue.length === 0) ? (totalLength - 1) : totalLength;

    for (let j = 6; j < item.data.length; j++) {
      let values:any = item.data[j];//values,
      let childObjKey = values[1];
      let emptyObj = {};

      // fixed by mazili on 20220520
      if(values.length === 0) continue;

      for (let k = 1; k < values.length; k++) {
        emptyObj[keys[k]] = values[k];
      }
      excelObj[childObjKey] = emptyObj;
    }
    result[excelName] = excelObj
  }
  return result;
}

/**
 * 转化为0x 16进制表示方式
 */
export const toHex = (num:number) => {
  let charArray = ['a','b','c','d','e','f'];
  let strArr = ['0','x','0','0','0','0','0','0','0','0'];
  let i = 9;

  while(num > 15) {
    let yushu = num % 16;
    if(yushu >= 10) {
      let index = yushu % 10;
      strArr [i--] = charArray[index];
    } else {
      strArr[i--] = yushu.toString();
    }
    num =  Math.floor(num/16);
  }

  if(num != 0){
    if(num >= 10) {
      let index = num % 10;
      strArr [i--] = charArray[index];
    } else {
      strArr[i--] = num.toString();
    }
  }
  let hex = strArr.join('');
  return hex;
}

/**
 * 范围随机
 */
export const toRandom = (minNumber:number, maxNumber:number):number => {
  let range = maxNumber - minNumber; //取值范围的差
  let random = Math.random(); //小于1的随机数
  return minNumber + Math.round(random * range);
}

/**
 * 补零
 */
export const numberToCode = (n: number) => {
  let code2 = n.toString(16);
  let length = 8;
  let spId = (Array(length).join('0') + code2).slice(-length);
  let ret = '0x' + spId;
  return ret;
}

/** 解析k:v */
export const parseKV2Obj= (origin: string) => {
  let kvObj = {};
  if(!origin) return kvObj;
  let oriAry = origin.split(',');
  for(let one of oriAry) {
    let kv = one.split(":");
    kvObj[kv[0]] = kv[1];
  }
  return kvObj;
}

// 目标时间是否发生在今天00:00之前
// 如果大于86400000表示相隔一天以上
export function GetPastResult(now: number): number {
  // 获取今日凌晨基准时间
  let baseTime = (new Date((new Date().toLocaleString().split(' ')[0]) + ' 00:00:00')).getTime();
  // 获取差值
  let deltaTime = baseTime - now;
  // 表示过去一天内返回1， 过去一天以上返回2， 不是昨天返回0
  return deltaTime >= 0 ? (deltaTime < 86400000 ?  1 : 2 ) : 0;
}

