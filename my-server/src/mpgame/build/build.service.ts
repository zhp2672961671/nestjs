import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Build } from './build.entity';
import { confFromJson, now, parseKV2Obj, GetPastResult } from 'src/app.utils';
import {
  CreateBuildDto,
  ListBuildDto,
  RemoveBuildDto,
  WorkBuildDto,
  FarmBuildDto,
  UpgradeBuildDto,
  GetBuildDto,
  MoveBuildDto,
  OpenBuildDto,
  RepoBuildDto,
} from './build.dto';
import { JobService } from '../job/job.service';
import { GeoService } from '../geo/geo.service';
import { AssetsService } from '../assets/assets.service';
import { BUILDTYPE, BUILD_FIND_OPTIONS, TYPE_GRID } from './build.config';
import { BaseService } from 'src/base/base.service';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { Cache } from 'cache-manager';
import { I18N_MESSAGE } from "../../constants/i18n.constant";
import { transaction } from 'src/app.utils';
import { ASSETS_FIND_OPTIONS } from '../assets/assets.config';
import { CONFIG_NAME } from 'src/app.config';

@Injectable()
export class BuildService extends BaseService {
  constructor(
    @InjectRepository(Build)
    private readonly build: Repository<Build>,
    private readonly jobService: JobService,
    private readonly geoService: GeoService,
    private readonly assetsService: AssetsService,
    protected readonly i18n: I18nRequestScopeService,
    @Inject(CACHE_MANAGER)
    protected readonly cache: Cache,
    private readonly dataSource: DataSource,
  ) {
    super( cache, i18n);
  }

 // 获取服务器时间戳
 async getTimestamp(): Promise<any> {
  return this.success({ tiemstamp: now() });
 }

  // 找建筑
  async getBuild(user: any, body: GetBuildDto): Promise<any> {
    if (! await this.jobService.checkSphereTokenId(user.address, body.sphereTokenId)) {
      return this.failShow(I18N_MESSAGE.NOT_OWN_SPHERE, { args: { sphereTokenId: body.sphereTokenId } });
    }

    let data = await this.build.findOneBy({ id: body.id });

    return this.success({ list_build: [data] });
  }

  // 拉建筑
  async listBuild(user: any, body: ListBuildDto): Promise<any> {
    if(! await this.jobService.checkSphereTokenId(user.address, body.sphereTokenId)) {
      return {
        errCode: 2,
        errMsg: `not owner the sphere ${body.sphereTokenId}`,
        data: {}
      }
    }

    let data = await this.build.find({
      where: {sphereTokenId: body.sphereTokenId}
    });

    return {
      errCode: 0,
      errMsg: 'success',
      data: { list_build: data }
    }
  }

  // 造建筑
  async createBuild(user: any, body: CreateBuildDto): Promise<any> {
    if(! await this.jobService.checkSphereTokenId(user.address, body.sphereTokenId)) {
      return {
        errCode: 2,
        errMsg: `not owner the sphere ${body.sphereTokenId}`
      }
    }

    // 新建筑基础数据结构
    const newBuild = {
      sphereTokenId: body.sphereTokenId,
      typeId: body.typeId,
      type: body.type,
      gridX: body.gridX,
      gridY: body.gridY,
      typeGrid: body.typeGrid,
      behaviorId: body.behaviorId,
      start_time: now(),
      work_time: 0,
      farm_time: 0,
      repo_list: [],
      open: false,
      created_at: new Date(),
      updated_at: new Date(),
    };

    // 根据类型区分
    switch(Number(body.type)) {
    case BUILDTYPE.COMMON:
      try {
        // 填路
        if(body.typeId === 10101) {
          await this.geoService.change2Road(body.sphereTokenId, body.gridX, body.gridY);
        } else {
          // 立即完成
          newBuild.start_time = 0;
          newBuild.open = true;
          var data = await this.build.save(newBuild);
        }
        return {
          errCode: 0,
          errMsg: "success",
          data: { add_build: data }
        }
      } catch(e) {
        throw new Error(e);
      }
    case BUILDTYPE.HOUSE:
      try {
        const cfg = confFromJson('build_base.json')[body.typeId];
        const cost_res = parseKV2Obj(cfg.cost_res);
        const assets = await this.assetsService.getAssets(body.sphereTokenId, { select: Object.keys(cost_res) });
        for(let key in cost_res) {
          // 消耗大于库存
          if(Number(cost_res[key]) > assets[key]) return {
            errCode: 10,
            errMsg: `not engouth assets ${key}:${assets[key]}`
          }
          else assets[key] = assets[key] - Number(cost_res[key]);
        }
        var resource:any;
        var build:any;
        await this.build.manager.transaction(async() => {
          resource = await this.assetsService.updateAssets(body.sphereTokenId, assets);
          build = await this.build.save(newBuild);
        });
        return {
          errCode: 0,
          errMsg: 'success',
          data: { update_assets: resource,  add_build: build }
        }
      } catch(e) {
        throw new Error(e);
      }
    case BUILDTYPE.FUNCTION:
      try {
        const cfg = confFromJson('build_base.json')[body.typeId];
        const cost_res = parseKV2Obj(cfg.cost_res);
        const assets = await this.assetsService.getAssets(body.sphereTokenId, { select: Object.keys(cost_res) });
        for(let key in cost_res) {
          // 消耗大于库存
          if(Number(cost_res[key]) > assets[key]) return {
            errCode: 10,
            errMsg: `not engouth assets ${key}:${assets[key]}`
          }
          else assets[key] = assets[key] - Number(cost_res[key]);
        }
        var resource:any;
        var build:any;
        await this.build.manager.transaction(async() => {
          resource = await this.assetsService.updateAssets(body.sphereTokenId, assets);
          build = await this.build.save(newBuild);
        });
        return {
          errCode: 0,
          errMsg: "success",
          data: { update_assets: resource,  add_build: build }
        }
      } catch(e) {
        throw new Error(e);
      }
    case BUILDTYPE.RESOURCE:
      try {
        const cfg = confFromJson('build_base.json')[body.typeId];
        const cost_res = parseKV2Obj(cfg.cost_res);
        const assets = await this.assetsService.getAssets(body.sphereTokenId, { select: Object.keys(cost_res) });
        for(let key in cost_res) {
          // 消耗大于库存
          if(Number(cost_res[key]) > assets[key]) return {
            errCode: 10,
            errMsg: `not engouth assets ${key}:${assets[key]}`
          }
          else assets[key] = assets[key] - Number(cost_res[key]);
        }
        var resource:any;
        var build:any;
        await this.build.manager.transaction(async() => {
          resource = await this.assetsService.updateAssets(body.sphereTokenId, assets);
          build = await this.build.save(newBuild);
        });
        return {
          errCode: 0,
          errMsg: "success",
          data: { update_assets: resource,  add_build: build }
        }
      } catch(e) {
        throw new Error(e);
      }
    case BUILDTYPE.REPOSITORY:
      try {
        const cfg = confFromJson('build_base.json')[body.typeId];
        const cost_res = parseKV2Obj(cfg.cost_res);
        const assets = await this.assetsService.getAssets(body.sphereTokenId, { select: Object.keys(cost_res) });
        for(let key in cost_res) {
          // 消耗大于库存
          if(Number(cost_res[key]) > assets[key]) return {
            errCode: 10,
            errMsg: `not engouth assets ${key}:${assets[key]}`
          }
          else assets[key] = assets[key] - Number(cost_res[key]);
        }
        var resource:any;
        var build:any;
        await this.build.manager.transaction(async() => {
          resource = await this.assetsService.updateAssets(body.sphereTokenId, assets);
          build = await this.build.save(newBuild);
        });
        return {
          errCode: 0,
          errMsg: "success",
          data: { update_assets: resource,  add_build: build }
        }
      } catch(e) {
        throw new Error(e);
      }
    case BUILDTYPE.LIBRARY:
      try {
        const cfg = confFromJson('build_base.json')[body.typeId];
        const cost_res = parseKV2Obj(cfg.cost_res);
        const assets = await this.assetsService.getAssets(body.sphereTokenId, { select: Object.keys(cost_res) });
        for(let key in cost_res) {
          // 消耗大于库存
          if(Number(cost_res[key]) > assets[key]) return {
            errCode: 10,
            errMsg: `not engouth assets ${key}:${assets[key]}`
          }
          else assets[key] = assets[key] - Number(cost_res[key]);
        }
        var resource:any;
        var build:any;
        await this.build.manager.transaction(async() => {
          resource = await this.assetsService.updateAssets(body.sphereTokenId, assets);
          build = await this.build.save(newBuild);
        });
        return {
          errCode: 0,
          errMsg: "success",
          data: { update_assets: resource,  add_build: build }
        }
      } catch(e) {
        throw new Error(e);
      }
    case BUILDTYPE.TECHNOLOGY:
      let buildTypeData = await this.build.find({
        where: { type: body.type, sphereTokenId: body.sphereTokenId }
      });
      if(buildTypeData.length > 0) {
        return {
          errCode: 3,
          errMsg: "technology build has only one"
        }
      }

      try {
        const cfg = confFromJson('build_base.json')[body.typeId];
        const cost_res = parseKV2Obj(cfg.cost_res);
        const assets = await this.assetsService.getAssets(body.sphereTokenId, { select: Object.keys(cost_res) });
        for(let key in cost_res) {
          // 消耗大于库存
          if(Number(cost_res[key]) > assets[key]) return {
            errCode: 10,
            errMsg: `not engouth assets ${key}:${assets[key]}`
          }
          else assets[key] = assets[key] - Number(cost_res[key]);
        }
        var resource:any;
        var build:any;
        await this.build.manager.transaction(async() => {
          resource = await this.assetsService.updateAssets(body.sphereTokenId, assets);
          build = await this.build.save(newBuild);
        });
        return {
          errCode: 0,
          errMsg: "success",
          data: { update_assets: resource,  add_build: build }
        }
      } catch(e) {
        throw new Error(e);
      }
    }
  }

  // 拆建筑
  async removeBuild(user: any, body: RemoveBuildDto): Promise<any> {
    if(! await this.jobService.checkSphereTokenId(user.address, body.sphereTokenId)) return {
      errCode: 2,
      errMsg: `not owner the sphere ${body.sphereTokenId}`,
      data: {}
    }

    if(body.ids.length === 0) return {
      errCode: 5,
      errMsg: 'noting to do'
    }

    // 批量拆路
    try {
      // 销毁建筑的资产
      let res:any;
      for(let id of body.ids) {
        let build = await this.build.findOneBy({id});
        switch(build.type) {
        case BUILDTYPE.HOUSE:
          let assets = await this.assetsService.getAssets(body.sphereTokenId, { select: ['9']});
          if(assets[9] < build.pop) return {
            errCode: 6,
            errMsg: 'population has in house',
          }
          res = await this.assetsService.updateAssets(body.sphereTokenId, { "9": assets[9] - build.pop });
          break;
        case BUILDTYPE.RESOURCE:
          if(build.slot > 0) return {
            errCode: 6,
            errMsg: 'slot has in build',
          }
          break;
        }
      }

      // 销毁减租
      await this.build.delete(body.ids);
      let del_build = [];
      for(let one of body.ids) del_build.push({id:one});
      return {
        errCode: 0,
        errMsg: 'success',
        data: { del_build, update_assets: res }
      }
    } catch(e) {
      throw new Error(e);
    }
  }

  // 建筑工作
  async workBuild(user: any, body: WorkBuildDto): Promise<any> {
    if(! await this.jobService.checkSphereTokenId(user.address, body.sphereTokenId)) {
      return {
        errCode: 2,
        errMsg: `not owner the sphere ${body.sphereTokenId}`,
        data: {}
      }
    }

    const build = await this.build.findOne({
      select:['typeId', 'type', 'slot', 'open', 'work_time', 'pop', 'farm_time', 'res'],
      where: { id: body.id }
    });

    if(!build) return {
      errCode: 3,
      errMsg: `not found this build ${body.id}`,
    }

    if(!build.open) return {
      errCode: 4,
      errMsg: `not open this build ${body.id}`,
    }

    if(build.work_time > 0) return {
      errCode: 5,
      errMsg: `build is farming ${body.id}`,
    }

    switch(build.type) {
    case BUILDTYPE.HOUSE:
      // 房子配置
      var cfg = confFromJson('build_house.json')[build.typeId];
      // 是否收菜上限
      if(build.pop >= cfg.pop_max) return {
        errCode: 7,
        errMsg: 'pop farm has max',
      }
      // 记录收菜字段
      await this.build.update(body.id, {
        work_time: now(),
        updated_at: new Date(),
      })
      var ub = await this.build.findOneBy({id: body.id});
      return {
        errCode: 0,
        errMsg: 'success',
        data: { update_build: [ub] }
      }
    case BUILDTYPE.RESOURCE:
      // 资源配置
      var cfg = confFromJson('build_resouce.json')[build.typeId];
      var assets = await this.assetsService.getAssets(body.sphereTokenId, {select: ['1','2','3','4','5','6','7','8','9']});
      // 清理每日上限
      if(GetPastResult(build.farm_time * 1000) > 0) build.res = 0;
      // 确定电池使用量
      if((body.slot > cfg.slot || body.slot <= 0) && body.slot > assets['9']) return {
        errCode: 8,
        errMsg: 'human slot error'
      }
      // 今日收益已满
      if((build.res + body.slot * cfg.out) > cfg.out_max) return {
        errCode: 8,
        errMsg: 'res farm max'
      }
      // 计算消耗
      var costs = parseKV2Obj(cfg.cost);
      for(let key in costs) {
        if(Number(costs[key]) * body.slot > assets[key]) return {
          errCode: 9,
          errMsg: 'not enough'
        }
        assets[key] = assets[key] - (Number(costs[key]) * body.slot);
      }
      assets['9'] = assets['9'] - body.slot;
      // 入库
      var ud:any;
      var res:any;
      await this.build.manager.transaction(async()=>{
        await this.build.update(body.id, {
          slot: body.slot,
          work_time: now(),
          updated_at: new Date(),
        });
        ud = await this.build.findOneBy({id:body.id});
        res = await this.assetsService.updateAssets(body.sphereTokenId, assets);
      });
      return {
        errCode: 0,
        errMsg: 'success',
        data: { update_build: [ud], update_assets: res }
      }
    case BUILDTYPE.LIBRARY:
      // 资源配置
      var cfg = confFromJson('build_library.json')[build.typeId];
      var assets = await this.assetsService.getAssets(body.sphereTokenId, {select: ['8','9']});
      // 确定电池使用量
      if((body.slot > cfg.slot || body.slot <= 0) && body.slot > assets['9']) return {
        errCode: 8,
        errMsg: 'human slot error'
      }
      assets['9'] = assets['9'] - body.slot;
      // 入库
      var ud:any;
      var res:any;
      await this.build.manager.transaction(async()=>{
        await this.build.update(body.id, {
          slot: body.slot,
          work_time: now(),
          updated_at: new Date(),
        });
        ud = await this.build.findOneBy({id:body.id});
        res = await this.assetsService.updateAssets(body.sphereTokenId, assets);
      });
      return {
        errCode: 0,
        errMsg: 'success',
        data: { update_build: [ud], update_assets: res }
      }
    default:
      return {
        errCode: 4,
        errMsg: 'build type error',
      }
    }
  }

  // 建筑收获
  async farmBuild(user: any, body: FarmBuildDto): Promise<any> {
    if(! await this.jobService.checkSphereTokenId(user.address, body.sphereTokenId)) return {
      errCode: 2,
      errMsg: `not owner the sphere ${body.sphereTokenId}`,
      data: {}
    }

    const build = await this.build.findOne({
      select:['typeId', 'type', 'slot', 'open', 'pop', 'work_time', 'res'],
      where: { id: body.id }
    });

    if(!build) return {
      errCode: 3,
      errMsg: `not found this build ${body.id}`,
    }

    if(!build.open) return {
      errCode: 4,
      errMsg: `not open this build ${body.id}`,
    }

    switch(build.type) {
      case BUILDTYPE.HOUSE:
        var cfg = confFromJson('build_house.json')[build.typeId];
        // 计算是否能收菜
        if(build.work_time === 0 || now() < build.work_time + cfg.pup_turn ) return {
          errCode: 6,
          errMsg: 'not in farm time',
        }
        // 是否收菜上限
        if(build.pop >= cfg.pop_max) return {
          errCode: 7,
          errMsg: 'pop farm has max',
        }
        var assets = await this.assetsService.getAssets(body.sphereTokenId, { select: ['6', '9'] });
        var aCfg = confFromJson('item.json');
        // 人口资产是否上限
        if(assets[9] + cfg.pop_up > aCfg[9].MaxValue) return {
          errCode: 7,
          errMsg: 'pop farm has max',
        }
        // 空闲资产是否上限
        if(assets[6] + cfg.pop_up > aCfg[6].MaxValue) return {
          errCode: 7,
          errMsg: 'pop farm has max',
        }
        var res:any;
        var ub:any;
        await this.build.manager.transaction(async()=> {
          await this.build.update(body.id, {
            pop: build.pop + cfg.pop_up,
            work_time: 0,
            farm_time: now(),
            updated_at: new Date(),
          });
          ub = await this.build.findOne({
            where: { id: body.id }
          })
          res = await this.assetsService.updateAssets(body.sphereTokenId, {
            '6': assets[6] + cfg.pop_up,  // 总人口上限
            '9': assets[9] + cfg.pop_up,  // 空闲上限
          });
        });
        return {
          errCode: 0,
          errMsg: 'success',
          data: { update_build: [ub], update_assets: res }
        }
      case BUILDTYPE.RESOURCE:
        var cfg = confFromJson('build_resouce.json')[build.typeId];
        // 计算是否能收菜
        if( build.work_time === 0 || now() < build.work_time + cfg.out_turn ) return {
          errCode: 6,
          errMsg: 'not in farm time',
        }
        // 今日上限
        if((build.res + build.slot * cfg.out) > cfg.out_max) return {
          errCode: 6,
          errMsg: 'farm max',
        }
        // 收的菜是否超过上限
        var growType = cfg.grow.toString();
        var assets = await this.assetsService.getAssets(body.sphereTokenId, { select: [growType, '9'] });
        var aCfg = confFromJson('item.json');
        var resMax = await this.calcRepoMax(body.sphereTokenId);

        // 现有量+ 单位量x电池 > 配置最大值 + 仓库扩容
        if((assets[growType] + build.slot * cfg.out) > (aCfg[growType].MaxValue + resMax[growType])) return {
          errCode: 7,
          errMsg: 'res has max',
        }

        // 计算资源变动
        build.res += build.slot * cfg.out;
        assets[growType] += build.slot * cfg.out;
        assets['9'] = assets['9'] + build.slot;

        // 入库
        var res:any;
        var ub:any;
        await this.build.manager.transaction(async()=>{
          await this.build.update(body.id, {
            res: build.res,
            slot: 0,
            work_time: 0,
            farm_time: now(),
            updated_at: new Date(),
          })
          res = await this.assetsService.updateAssets(body.sphereTokenId, assets);
          ub = await this.build.findOneBy({id:body.id});
        });
        return {
          errCode: 0,
          errMsg: 'success',
          data: { update_build: [ub], update_assets: res }
        }
      case BUILDTYPE.LIBRARY:
        var cfg = confFromJson('build_library.json')[build.typeId];
        // 计算是否能收菜
        if(build.work_time === 0 || now() < build.work_time + cfg.out_turn ) return {
          errCode: 6,
          errMsg: 'not in farm time',
        }
        var assets = await this.assetsService.getAssets(body.sphereTokenId, { select: ['8', '9'] });
        var aCfg = confFromJson('item.json');
        // 学点资产是否上限
        if(assets[8] + (cfg.out * build.slot)  > aCfg[9].MaxValue) return {
          errCode: 7,
          errMsg: 'pop farm has max',
        }

        // 计算资源变动
        assets['8'] = assets['8'] + build.slot * cfg.out;
        assets['9'] = assets['9'] + build.slot;

        // 入库
        var res:any;
        var ub:any;
        await this.build.manager.transaction(async()=>{
          await this.build.update(body.id, {
            slot: 0,
            work_time: 0,
            farm_time: now(),
            updated_at: new Date(),
          })
          res = await this.assetsService.updateAssets(body.sphereTokenId, assets);
          ub = await this.build.findOneBy({id:body.id});
        });

        return {
          errCode: 0,
          errMsg: 'success',
          data: { update_build: [ub], update_assets: res }
        }
      default:
        return {
          errCode: 5,
          errMsg: 'build type error',
        }
    }
  }

  // 给建筑升级
  async upgradeBuild(user: any, body: UpgradeBuildDto): Promise<any> {
    if(! await this.jobService.checkSphereTokenId(user.address, body.sphereTokenId)) {
      return {
        errCode: 2,
        errMsg: `not owner the sphere ${body.sphereTokenId}`,
        data: {}
      }
    }

    const build = await this.build.findOne({
      select:['typeId', 'level', 'open'],
      where: { id: body.id }
    });

    if(!build) return {
      errCode: 3,
      errMsg: `not found this build ${body.id}`,
    }

    if(!build.open) return {
      errCode: 4,
      errMsg: `not open this build ${body.id}`,
    }

    const buildConf = confFromJson('build_base.json')[build.typeId];
    if(!buildConf) return {
      errCode: 5,
      errMsg: 'build typeId error'
    }

    if(buildConf.nextlevel < 1) return {
      errCode: 7,
      errMsg: 'build not upgrade'
    }

    if(build.typeId === 10101) return {
      errCode: 11,
      errMsg: 'build not upgrade'
    }

    const cfg = confFromJson('build_base.json')[buildConf.nextlevel];
    const cost_res = parseKV2Obj(cfg.cost_res);
    const assets = await this.assetsService.getAssets(body.sphereTokenId, { select: Object.keys(cost_res) });
    for(let key in cost_res) {
      // 消耗大于库存
      if(Number(cost_res[key]) > assets[key]) return {
        errCode: 10,
        errMsg: `not engouth assets ${key}:${assets[key]}`
      }
      else assets[key] = assets[key] - Number(cost_res[key]);
    }

    try {
      build.level = build.level + 1;
      let newBuild:any;
      let resource:any;
      await this.build.manager.transaction(async()=>{
        await this.build.update(body.id, {
          typeId: buildConf.nextlevel,
          level: build.level,
          updated_at: new Date(),
        });
        newBuild = await this.build.findOneBy({id: body.id});
        resource = await this.assetsService.updateAssets(body.sphereTokenId, assets);
      });
      return {
        errCode: 0,
        errMsg: 'success',
        data: { update_build: [newBuild], update_assets: resource }
      }
    }
    catch(err) {
      throw new Error(err);
    }
  }

  // 移动建筑
  async moveBuild(user: any, body: MoveBuildDto): Promise<any> {
    // 判断归属
    if(! await this.jobService.checkSphereTokenId(user.address, body.sphereTokenId)) {
      return {
        errCode: 2,
        errMsg: `not owner the sphere ${body.sphereTokenId}`,
        data: {}
      }
    }

    const build = await this.build.findOne({
      select:['typeId', 'open'],
      where: { id: body.id }
    });

    if(!build) {
      return {
        errCode: 3,
        errMsg: `not found this build ${body.id}`,
      }
    }

    if(!build.open) return {
      errCode: 4,
      errMsg: `not open this build ${body.id}`,
    }

    try {
      await this.build.update(body.id, {
        gridX: body.gridX,
        gridY: body.gridY,
        updated_at: new Date(),
      });
      let newBuild = await this.build.findOneBy({id: body.id});
      return {
        errCode: 0,
        errMsg: 'success',
        data: { update_build: [newBuild] },
      }
    }
    catch(err) {
      throw new Error(err);
    }
  }

  // 开启建筑
  async openBuild(user: any, body: OpenBuildDto): Promise<any> {
    // 判断归属
    if(! await this.jobService.checkSphereTokenId(user.address, body.sphereTokenId)) {
      return {
        errCode: 2,
        errMsg: `not owner the sphere ${body.sphereTokenId}`,
        data: {}
      }
    }

    const build = await this.build.findOne({
      select:['typeId', 'start_time', 'open'],
      where: { id: body.id }
    });
    if(!build) {
      return {
        errCode: 3,
        errMsg: `not found this build ${body.id}`,
      }
    }

    if(build.open === true) return {
      errCode: 7,
      errMsg: 'build has already opened'
    }

    const buildConf = confFromJson('build_base.json')[build.typeId];
    if(!buildConf) return {
      errCode: 5,
      errMsg: 'build typeId error'
    }


    if(now() < build.start_time + buildConf.cost_time) return {
      errCode: 8,
      errMsg: 'build can not open because during in created process'
    }

    try {
      await this.build.update(body.id, { open: true });
      let ub = await this.build.findOne({
        where: { id: body.id }
      });
      return {
        errCode: 0,
        errMsg: 'success',
        data: { update_build: [ub] },
      }
    }
    catch(e) {
      throw new Error(e);
    }
  }

  // 存放资源
  async repoBuild(user: any, body: RepoBuildDto): Promise<any> {
    // 判断归属
    if(! await this.jobService.checkSphereTokenId(user.address, body.sphereTokenId)) return {
      errCode: 2,
      errMsg: `not owner the sphere ${body.sphereTokenId}`,
    }

    await this.calcRepoMax(body.sphereTokenId);

    const build = await this.build.findOne({
      where: { id: body.id }
    });
    if(!build) return {
      errCode: 3,
      errMsg: `not found this build ${body.id}`,
    }

    if(!build.open) return {
      errCode: 4,
      errMsg: `not open this build ${body.id}`,
    }

    if(build.type !== BUILDTYPE.REPOSITORY) return {
      errCode: 5,
      errMsg: `build type is not repository ${body.id}`,
    }

    const cfg = confFromJson('build_repoistory.json')[build.typeId];
    if(Object.keys(body.value).length +  build.repo_list.length > cfg.slot) return {
      errCode: 6,
      errMsg: `not enough slot ${body.id}`,
    }

    for(let key in body.value) {
      if(body.value[key] > cfg.capactiy) return {
        errCode: 6,
        errMsg: `not capactiy slot ${body.id}`,
      }
      let kv = {};
      kv[key] = body.value[key];
      build.repo_list.push(JSON.stringify(kv));
    }
    // 更新数据
    await this.build.update(body.id, {
      repo_list: build.repo_list,
      updated_at: new Date(),
    });
    let ub = await this.build.findOneBy({id:body.id});
    return {
      errCode: 0,
      errMsg: 'success',
      data: { update_build: [ub] }
    }
  }

  // 计算仓库上限
  async calcRepoMax(sphereTokenId: string) {
    let repos = await this.build.find({
      select:['repo_list'],
      where: { sphereTokenId, type: BUILDTYPE.REPOSITORY }
    })

    let result = {}
    for(let repo of repos) {
      let resList = repo.repo_list;
      for(let res of resList) {
        let one = JSON.parse(res);
        let key = Object.keys(one)[0];
        let value = one[key];
        if(!result[key]) result[key] = 0;
        result[key] += value;
      }
    }

    return result;
  }
}
