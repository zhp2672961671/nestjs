import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// https://www.kancloud.cn/erull/typeorm/
import { Repository } from 'typeorm';
import { Passport, Order } from './job.entity';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Passport)
    private readonly passport: Repository<Passport>,
    @InjectRepository(Order)
    private readonly order: Repository<Order>,
  ) {}

  async listSphere(body: any): Promise<any> {
    // 查询符合address== body.address
    let ret = await this.passport.find({
      select:['address', 'mpTokenId'],
      where: { address: body.address },
    });

    let sphere = [];
    for(let i=0; i<ret.length; i++) {
      sphere.push({
        "sphereOwner": ret[i].address,
        "sphereIndex": i+1,
        "sphereName": "星球" + (i+1) + "号",
        "sphereTokenId": ret[i].mpTokenId,
      });
    }

    return {
      errCode: 0,
      errMsg: 'success',
      data: { list_sphere: sphere },
    };
  }

  async checkOrder(body: any): Promise<any> {
    // findOne - 查找匹配某些 ID 或查找选项的第一个实体。
    let ret =  await this.order.findOne({
      select: ['orderIndex', 'state', 'updated_at'],
      where: { orderIndex: body.orderIndex, from: body.address },
    });
    return {
      errCode: 0,
      errMsg: 'success',
      data: ret || '查无此订单' ,
    }
  }

  async listOrder(body: any): Promise<any> {
    // 1.升序 ：ASC（默认） 2. 降序： DESC
    let ret = await this.order.find({
      select: ['orderIndex', 'state', 'updated_at'],
      where: { from: body.address },
      order: { orderIndex: 'ASC' },
    });
    return {
      errCode: 0,
      errMsg: 'success',
      data: ret,
    }
  }

  // 校验是否应有星球
  async checkSphereTokenId(address:string, sphereTokenId:string) {
    return await this.passport.findOneBy({
      address,
      mpTokenId: sphereTokenId,
    });
  }
}
