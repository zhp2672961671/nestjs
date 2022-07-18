import { Injectable } from '@nestjs/common';
import { confFromJson, toHex, toRandom } from 'src/app.utils';
import { GetGeoDto, SyncGeoDto, ChangeGeoDto, ResetGeoDto } from './geo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Geography } from './geo.entity';
import { LANDTYPE, CROSSTYPE } from './geo.config';
import { JobService } from '../job/job.service';

const MAX_GEOGRAPHY = 1600;
const GRID_LENGTH_X = 40;

@Injectable()
export class GeoService {
  constructor(
    @InjectRepository(Geography)
    private readonly geography: Repository<Geography>,
    private readonly jobService: JobService,
  ) {}

  // 获取某玩家的地形（如果没有则随机创建一个）
  async getList(user: any, body: GetGeoDto): Promise<any> {
    if(! await this.jobService.checkSphereTokenId(user.address, body.sphereTokenId)) {
      return {
        errCode: 2,
        errMsg: `not owner the sphere ${body.sphereTokenId}`,
        data: {}
      }
    }

    let ret = await this.geography.findOneBy({sphereTokenId:body.sphereTokenId});
    if(!ret) {
      let newList = this.generateGeography();
      // 数据入库
      try {
        await this.geography.save({
          sphereTokenId: body.sphereTokenId,
          geo_list: newList,
          updated_at: new Date(),
          created_at: new Date(),
        });
        return {
          errCode: 0,
          errMsg: 'success',
          data: { list_geo: newList },
        }
      } catch(e) {
        throw new Error(e);
      }
    } else return {
      errCode: 0,
      errMsg: 'success',
      data: { list_geo: ret.geo_list },
    }
  }

  // 更新地形
  async syncList(user: any, body: SyncGeoDto): Promise<any> {
    try {
      if(! await this.jobService.checkSphereTokenId(user.address, body.sphereTokenId)) {
        return {
          errCode: 2,
          errMsg: `not owner the sphere ${body.sphereTokenId}`,
          data: {}
        }
      }

      await this.geography.update({sphereTokenId:body.sphereTokenId}, {
        geo_list: body.list,
        updated_at: new Date(),
      });

      return {
        errCode: 0,
        errMsg: 'success',
        data: { list_geo: body.list },
      }
    } catch(e) {
      throw new Error(e);
    }
  }

  // 改变地形
  async changeGeography(user: any, body: ChangeGeoDto): Promise<any> {
    if(! await this.jobService.checkSphereTokenId(user.address, body.sphereTokenId)) {
      return {
        errCode: 2,
        errMsg: `not owner the sphere ${body.sphereTokenId}`,
        data: {}
      }
    }

    let ret = await this.geography.findOneBy({sphereTokenId:body.sphereTokenId});
    if(!ret) return {
      errCode: 3,
      errMsg: `not found the sphereData ${body.sphereTokenId}`,
      data: {}
    }

    // 更新地形
    ret.geo_list[body.gridY * GRID_LENGTH_X + body.gridX] = body.geography;

    // 写入数据库
    await this.geography.update({sphereTokenId:body.sphereTokenId}, {
      geo_list: ret.geo_list,
      updated_at: new Date()
    });

    let update_geo = {};
    update_geo[body.gridY * GRID_LENGTH_X + body.gridX] = body.geography;

    return {
      errCode: 0,
      errMsg: 'success',
      data: { update_geo }
    }
  }

  // 复位地形
  async resetList(user: any, body: ResetGeoDto): Promise<any> {
    if(! await this.jobService.checkSphereTokenId(user.address, body.sphereTokenId)) {
      return {
        errCode: 2,
        errMsg: `not owner the sphere ${body.sphereTokenId}`,
        data: {}
      }
    }

    // 写入数据库
    try {
      await this.geography.update({sphereTokenId:body.sphereTokenId}, {
        geo_list: this.generateGeography(),
        updated_at: new Date()
      });
      let list = await this.geography.findOneBy({sphereTokenId:body.sphereTokenId});
      // console.log(list)
      return {
        errCode: 0,
        errMsg: 'success',
        data: { list_geo: list.geo_list },
      }
    }
    catch(e) {
      throw new Error(e);
    }
  }

  // 创建一个随机地形
  generateGeography(): string[] {
    let geoList = [];

    // 获取配置
    const cfg = confFromJson('randomLand.json');

    // 第一步填海
    for(let i=0; i<MAX_GEOGRAPHY; i++) {
      let geoBlock = CROSSTYPE.NO;
      let geoType = LANDTYPE.WATERDARK;
      // 16 ** 2  16的二次方
      let geoDesc = (16 ** 2) * geoBlock + geoType;
      geoList.push(toHex(geoDesc));
    }

    for(let key in cfg) {
      let step = cfg[key];
      let canChangeGrid = step.sourceId.split(',');
      let randomNum = toRandom(step.randommin, step.randommax);
      this.randomRange(geoList, step.startX, step.startY, step.rangeX, step.rangeY, randomNum, step.targetId, canChangeGrid);
    }

    // 第三步 陆地内深海变糊
    // this.randomRange(geoList, 0, 0, 34, 2, 50, '0x00000003', ['0x00000004']);
    // this.randomRange(geoList, 3, 3, 2, 34, 50, LANDTYPE.WATER, [LANDTYPE.WATERDARK]);
    // this.randomRange(geoList, 5, 5, 32, 32, 900, LANDTYPE.WATER, [LANDTYPE.WATERDARK]);

    // // 第二步 中心随机大陆
    // this.randomRange(geoList, 5, 5, 30, 2, 40, LANDTYPE.LAND, [LANDTYPE.WATERDARK, LANDTYPE.WATER]);
    // this.randomRange(geoList, 5, 5, 2, 30, 40, LANDTYPE.LAND, [LANDTYPE.WATERDARK, LANDTYPE.WATER]);
    // this.randomRange(geoList, 7, 7, 28, 28, 666, LANDTYPE.LAND, [LANDTYPE.WATERDARK, LANDTYPE.WATER]);


    // // 第四步 随机陆地变草地
    // this.randomRange(geoList, 5, 5, 30, 30, 100, LANDTYPE.GRASS, [LANDTYPE.LAND]);

    // // 第五步 随机岩石
    // this.randomRange(geoList, toRandom(10,25), toRandom(10,25), 5, 5, 10, LANDTYPE.ROAD, [LANDTYPE.GRASS, LANDTYPE.LAND]);
    // this.randomRange(geoList, toRandom(10,25), toRandom(10,25), 5, 5, 10, LANDTYPE.ROAD, [LANDTYPE.GRASS, LANDTYPE.LAND]);
    // this.randomRange(geoList, toRandom(10,25), toRandom(10,25), 5, 5, 10, LANDTYPE.ROAD, [LANDTYPE.GRASS, LANDTYPE.LAND]);

    // this.randomRange(geoList, toRandom(10,25), toRandom(10,25), 5, 5, 10, 0x10000+LANDTYPE.ROAD, [LANDTYPE.GRASS, LANDTYPE.LAND, ]);

    return geoList;
  }

  /**
   * @param sx 开始X
   * @param sy 开始Y
   * @param rangeX 范围X
   * @param rangeY 范围Y
   * @param num 随机多少个
   * @param targetGid 改成的目标GID
   * @param canChangeGid 可以覆盖的GID
   *
    比如200个地块中选择50格：
    1 随机选择一个格子 将这个格子放入开放列表 再将这个格子的周边6个地块加入候选列表
    2 在候选列表中随机选择一个格子 将这个格子加入开放列表 并将周边不在开放和候选列表的格子 加入候选列表
    3 循环第二步直到开放列表长度=50
   */
  randomRange (gridData: string[],  sx: number, sy: number, rangeX: number, rangeY: number, num: number, targetGid: string, canChangeGid:string[]) {
    function listPushNotIn(x:number, y:number, opList:any[], waitList:any[], closeList:any[]) {
      if(x<sx || y<sy || x>=sx+rangeX || y>=sy+rangeY ) { //越界步处理
        return false;
      }

      let grid = gridData[y * GRID_LENGTH_X + x]
      if(canChangeGid.indexOf(grid) < 0) { //不可改不处理
        return false;
      }

      if(notIn(x, y, opList) && notIn(x, y, waitList) && notIn(x, y, closeList)) {
        waitList.push([x, y])
        return true
      }
    }

    function pushArrByPot(x:number, y:number, opList:any[], wtList:any[], clList:any[]) {
      if (y % 1 == 0) {  //[x-1],[x]
        listPushNotIn(x - 1, y - 1, opList, wtList, clList);
        listPushNotIn(x, y - 1, opList, wtList, clList);
        listPushNotIn(x - 1, y, opList, wtList, clList);
        listPushNotIn(x + 1, y, opList, wtList, clList);
        listPushNotIn(x - 1, y + 1, opList, wtList, clList);
        listPushNotIn(x, y + 1, opList, wtList, clList);
      } else {
        listPushNotIn(x, y - 1, opList, wtList, clList);
        listPushNotIn(x + 1, y - 1, opList, wtList, clList);
        listPushNotIn(x - 1, y, opList, wtList, clList);
        listPushNotIn(x + 1, y, opList, wtList, clList);
        listPushNotIn(x, y + 1, opList, wtList, clList);
        listPushNotIn(x + 1, y + 1, opList, wtList, clList);
      }
    }

    function notIn(x:number, y:number, arr:any[]) {
      for (let i in arr) {
        if (arr[i][0] == x && arr[i][1] == y) {
          return false;
        }
      }
      return true;
    }

    let openList = [];
    let waitList = [];
    let closeList = [];
    let rx = Math.floor(Math.random() * rangeX) + sx;
    let ry = Math.floor(Math.random() * rangeY) + sy;
    let grid = gridData[ry * GRID_LENGTH_X + rx];

    // 目标格子不是指定road，再次随机
    let cnt = 0;
    while(canChangeGid.indexOf(grid) < 0 && cnt < 100) {
      rx = Math.floor(Math.random() * rangeX) + sx;
      ry = Math.floor(Math.random() * rangeY) + sy;
      grid = gridData[ry * GRID_LENGTH_X + rx];
      cnt ++;
    }

    // 什么都不操作
    if(cnt >= 100) return [];

    openList.push([rx, ry]);
    pushArrByPot(rx, ry, openList, waitList, closeList);

    while (openList.length < num && waitList.length > 0) {
      let ind = Math.floor(Math.random() * waitList.length);
      let target = waitList[ind];
      openList.push([target[0], target[1]]);
      waitList.splice(ind,1);
      pushArrByPot(target[0], target[1], openList, waitList, closeList);
    }

    // 替换
    for(let k in openList) {
      gridData[openList[k][1] * GRID_LENGTH_X + openList[k][0]] = targetGid;
    }

    return openList;
  }

  // 改变地形为路
  async change2Road(tokenId:string, gridX:number, gridY:number): Promise<any> {
    let ret = await this.geography.findOneBy({sphereTokenId:tokenId});
    if(!ret) return;
    let temp = ret.geo_list[gridY* GRID_LENGTH_X + gridX].split('');
    temp[7] = '1';
    ret.geo_list[gridY* GRID_LENGTH_X + gridX] = temp.join('');
    await this.geography.update({sphereTokenId:tokenId}, {
      geo_list: ret.geo_list,
      updated_at: new Date()
    });
  }

  // 还原地形
  async change2Origin(tokenId:string, gridX:number, gridY:number): Promise<any> {
    let ret = await this.geography.findOneBy({sphereTokenId:tokenId});
    if(!ret) return;
    let temp = ret.geo_list[gridY* GRID_LENGTH_X + gridX].split('');
    temp[7] = '0';
    ret.geo_list[gridY* GRID_LENGTH_X + gridX] = temp.join('');
    await this.geography.update({sphereTokenId:tokenId}, {
      geo_list: ret.geo_list,
      updated_at: new Date()
    });
  }
}
