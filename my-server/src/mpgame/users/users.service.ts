import { BadRequestException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './users.dto';
import { EthService } from 'src/blockchain/eth/eth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly ethService: EthService,
  ) {}

  // 根据钱包地址查找
  async findOneByAddress(address: string): Promise<any> {
    return await this.usersRepository.findOneBy({address});
  }

  // 根据ID查找
  async findOneById(id: string): Promise<any> {
    return await this.usersRepository.findOneBy({id});
  }

  // 开设以太账户
  async getOrCreateEthAccount(id: string): Promise<any> {
    // let acc: any = await this.attachEthRepository.findOne({
    //   bind_id: id
    // });

    // if(!acc) {
    //   // 创建一个以太坊帐户
    //   let wallet = this.ethService.createAccount();
    //   try {
    //     acc = await this.attachEthRepository.save({
    //       bind_id: id,
    //       addr: wallet.address,
    //       sk: wallet.privateKey
    //     });
    //   } catch(e) {
    //     this.logger.error(e, '', UsersService.name);
    //     throw new ServiceUnavailableException();
    //   }
    // }

    return {
      errCode: 0,
      errMsg: 'success',
      // data: acc.addr,
    }
  }

  // 创建用户
  async create(address: string): Promise<any> {
    // 发生名字更改，则校验名字\
    console.log("创建用户========")
    const isExist = await this.usersRepository.count({
      where: {
        address,
      },
    });

    // 出现重复则返回空用户，并日志
    if(isExist > 0) {
      console.log(`${address} has exist, register again !`);
      return null;
    }

    // 构建一个用户结构
    const createUserDto = {
      address: address,
      avatar: "",
      roles: ['user'],
      created_at: new Date(),
      updated_at: new Date(),
    }

    // 返回创建结果
    return await this.usersRepository.save(createUserDto);
  }

  // 开设账户
  async pay(params: any): Promise<any> {
    switch(params.type) {
      default:  //默认以太坊
        return await this.getOrCreateEthAccount(params.user.id);
    }
  }

  // 更新用户信息
  async update(user: any): Promise<any> {
    // 数据库
    let dbUser = await this.findOneById(user.id) || user;
    if(!dbUser) {
      throw new BadRequestException();
    }

    // 返回结果
    return {
      errCode: 0,
      errMsg: 'success',
      data: { user: dbUser },
    }
  }

  // // 删除用户
  // async remove(removeUserDto: RemoveUserDto): Promise<any> {
  //   const { ids } = removeUserDto;
  //   return await this.usersRepository.delete(ids);
  // }

  // // 更新用户
  // async update(updateUserData: any): Promise<any> {
  //   const { id, updateUserDto } = updateUserData;
  //   updateUserDto.updatedAt = new Date();
  //   const { name } = updateUserDto;

  //   // 发生名字更改，则校验名字
  //   const isExist = await this.usersRepository.count({
  //     where: {
  //       name,
  //     },
  //   });

  //   if (isExist > 1) {
  //     return {
  //       statusCode: 202,
  //       message: '用户名已存在',
  //     };
  //   }

  //   return await this.usersRepository.update(id, updateUserDto);
  // }

  // // 列表查询
  // async findAll(query: any): Promise<any> {
  //   const { keyword, page = 1, limit = 10 } = query;
  //   const skip = (page - 1) * limit;

  //   // 查询关键字
  //   let whereParams = {};
  //   if (keyword) {
  //     whereParams = Object.assign(whereParams, {
  //       name: Like(`%${keyword}%`),
  //     });
  //   }

  //   let params = {
  //     skip,
  //     take: limit,
  //   };

  //   params = Object.assign(
  //     {
  //       select: ['id', 'name', 'updatedAt', 'status'],
  //     },
  //     params,
  //     {
  //       where: whereParams,
  //     },
  //     {
  //       order: {
  //         updatedAt: 'DESC',
  //       },
  //     },
  //   );

  //   const [data, total] = await this.usersRepository.findAndCount(params);

  //   return {
  //     total,
  //     data,
  //   };
  // }



  // // 更新密码
  // async updatePassword(data: any): Promise<any> {
  //   const { id, body } = data;
  //   const user = await this.usersRepository.findOne(id);

  //   if (!user) {
  //     return {
  //       statusCode: 202,
  //       message: '用户不存在',
  //     };
  //   }

  //   if (user.password !== cryptoString(body.oldPassword)) {
  //     return {
  //       statusCode: 400,
  //       message: '旧密码不正确。',
  //     };
  //   }

  //   if (body.password !== body.rePassword) {
  //     return {
  //       statusCode: 400,
  //       message: '两次密码不一致。',
  //     };
  //   }

  //   body.password = cryptoString(body.rePassword);
  //   body.updatedAt = new Date();
  //   delete body.oldPassword;
  //   delete body.rePassword;

  //   return await this.usersRepository.update(id, body);
  // }

  // // 重置密码
  // async resetPassword(params: any): Promise<any> {
  //   // 参数需包含id
  //   const { id } = params;

  //   // 检验用户存在与否
  //   const user = await this.usersRepository.findOne(id);
  //   if (!user) {
  //     return {
  //       statusCode: 202,
  //       message: '用户不存在',
  //     };
  //   }

  //   // 默认长度10 数字
  //   const password = generator.generate({
  //     length: 10,
  //     numbers: true,
  //     symbols: false,
  //   });

  //   // 构造更改数据
  //   const data = {
  //     password: cryptoString(password),
  //     updatedAt: new Date(),
  //   };

  //   const result = await this.usersRepository.update(id, data);

  //   return {
  //     password,
  //     result,
  //   };
  // }

  // // 更新头像
  // async updateAvatar(params: any): Promise<any> {
  //   const { id, updateUserAvatarDto } = params;
  //   updateUserAvatarDto.updatedAt = new Date();
  //   return await this.usersRepository.update(id, updateUserAvatarDto);
  // }

  // // 获取数量
  // async getCount() {
  //   return await this.usersRepository.count();
  // }
}
