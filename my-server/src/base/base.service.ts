
import { Cache } from "cache-manager";
import { I18N_MESSAGE } from "../constants/i18n.constant";
// 国际化字符串
import { I18nRequestScopeService } from "nestjs-i18n";


export enum ERROR_CODE {
  OK,
  FAIL,
  SHOW_MESSAGE
}


// @UseFilters(TestExceptionFilter)
export class BaseService {
  constructor(
    protected readonly cache: Cache,
    protected readonly i18n: I18nRequestScopeService,
  ) { }

  // 逻辑执行成功，返回标准成功结果
  success(data: object | string = {}, msg: string = I18N_MESSAGE.SUCCESS): object {
    return {
      errCode: ERROR_CODE.OK,
      errMsg: this.i18n.t(msg),
      data: data
    };
  }

  // 执行逻辑失败
  fail(msg: string = I18N_MESSAGE.FAIL, args: any = {}): object {
    return {
      errCode: ERROR_CODE.FAIL,
      errMsg: this.i18n.t(msg, args)
    };
  }

  // 客户端需要展示的message
  failShow(msg: string = I18N_MESSAGE.SHOW_MESSAGE, args: any = {}, data: object | string = {}): object {
    return {
      errCode: ERROR_CODE.SHOW_MESSAGE,
      errMsg: this.i18n.t(msg, args),
      data: data
    };
  }
}