import { CACHE_MANAGER, Injectable, Inject } from '@nestjs/common';;
import { confFromJson } from 'src/app.utils';
import { QueryRunner, Repository } from 'typeorm';
import { Assets } from './assets.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ListAssetsDto } from './assets.dto';
import { JobService } from '../job/job.service';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { Cache } from 'cache-manager';
import { BaseService } from 'src/base/base.service';
import { CONFIG_NAME } from 'src/app.config';
import { I18N_MESSAGE } from 'src/constants/i18n.constant';

@Injectable()
export class AssetsService extends BaseService {
  constructor (
    @InjectRepository(Assets)
    private readonly assets: Repository<Assets>,
    private readonly jobService: JobService,
    protected readonly i18n: I18nRequestScopeService,
    @Inject(CACHE_MANAGER)
    protected readonly cache: Cache,
  ) {
    super( cache, i18n);
  }

  // 创建资产
  async generateAsssets(sphereTokenId: string): Promise<any> {
    try {
      const cfg = confFromJson(CONFIG_NAME.ITEM);
      const options = {
        sphereTokenId,
        created_at: new Date(),
        updated_at: new Date(),
      }
      for (let key in cfg) options[key] = cfg[key].defaultValue;
      return await this.assets.save(options);
    }
    catch (e) {
      throw new Error(e);
    }
  }

  // 获取资产
  async listAssets(user: any, body: ListAssetsDto): Promise<any> {
    if (! await this.jobService.checkSphereTokenId(user.address, body.sphereTokenId)) {
      return this.failShow(I18N_MESSAGE.NOT_OWN_SPHERE, { args: { sphereTokenId: body.sphereTokenId } });
    }

    let list_assets = await this.assets.findOne({
      where: { sphereTokenId: body.sphereTokenId },
    });

    if (!list_assets) list_assets = await this.generateAsssets(body.sphereTokenId);
    return this.success({ list_assets });
  }

  // 获取资产
  async getAssets(sphereTokenId: string, options = {}, queryRunner?: QueryRunner) {
    return queryRunner ? await queryRunner.manager.findOne(Assets, {
      where: { sphereTokenId },
      ...options
    }) : await this.assets.findOne({
      where: { sphereTokenId },
      ...options
    });
  }

  // 变更资产
  async updateAssets(sphereTokenId: string, options = {}, queryRunner?: QueryRunner) {
    if (queryRunner) {
      await queryRunner.manager.update(Assets, { sphereTokenId: sphereTokenId }, options);
    } else {
      await this.assets.update({ sphereTokenId }, options);
    }

    let select = Object.keys(options);
    return await this.getAssets(sphereTokenId, { select }, queryRunner);
  }
}
