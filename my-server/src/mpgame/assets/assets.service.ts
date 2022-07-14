import { Injectable } from '@nestjs/common';;
import { confFromJson } from 'src/app.utils';
import { Repository } from 'typeorm';
import { Assets } from './assets.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ListAssetsDto } from './assets.dto';
import { JobService } from '../job/job.service';

@Injectable()
export class AssetsService {
  constructor (
    @InjectRepository(Assets)
    private readonly assets: Repository<Assets>,
    private readonly jobService: JobService,
  ) {}

  // 创建资产
  async generateAsssets(sphereTokenId: string): Promise<any> {
    try {
      const cfg = confFromJson('item.json');
      const options = {
        sphereTokenId,
        created_at: new Date(),
        updated_at: new Date(),
      }
      for(let key in cfg) options[key] = cfg[key].defaultValue;
      return await this.assets.save(options);
    }
    catch(e) {
      throw new Error(e);
    }
  }

  // 获取资产
  async listAssets(user:any, body: ListAssetsDto): Promise<any> {
    if(! await this.jobService.checkSphereTokenId(user.address, body.sphereTokenId)) {
      return {
        errCode: 2,
        errMsg: `not owner the sphere ${body.sphereTokenId}`,
      }
    }

    let list_assets = await this.assets.findOne({
      where: { sphereTokenId: body.sphereTokenId },
    });

    if(!list_assets) list_assets = await this.generateAsssets(body.sphereTokenId);

    return {
      errCode: 0,
      errMsg: 'success',
      data: { list_assets },
    }
  }

  // 获取资产
  async getAssets(sphereTokenId: string, options = {}) {
    return await this.assets.findOne({ 
      where: { sphereTokenId },
      ...options
    });
  }

  // 变更资产
  async updateAssets(sphereTokenId: string, options = {}) {
    await this.assets.update({sphereTokenId}, options);
    let select = Object.keys(options);
    return await this.getAssets(sphereTokenId, { select });
  }
}
