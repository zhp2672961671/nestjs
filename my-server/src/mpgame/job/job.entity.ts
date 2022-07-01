import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
// TypeORM 支持存储库设计模式，因此每个实体都有自己的存储库。可以从数据库连接获得这些存储库。
/** 同步mint事件任务 */
/*
Entity是由@Entity装饰器装饰的模型。将为此类模型创建数据库表。
你可以使用 TypeORM 处理各处的实体，可以使用它们 load/insert/update/remove 并执行其他操作。
 */
@Entity('mint_event')
export class MintEvent {
      // 每个实体必须至少有一个主键列。这是必须的，你无法避免。要使列成为主键，您需要使用@PrimaryColumn装饰器。
  // @PrimaryColumn装饰器更改为@PrimaryGeneratedColumn装饰器：创建自动生成的列
  @PrimaryGeneratedColumn('uuid')
  id: string;
// 要添加数据库列，你只需要将要生成的实体属性加上@Column装饰器。
  @Column({
    length: 64,
    comment: '合约地址',
  })
  contract_address: string;

  @Column({
    comment: '监听到的事件数量',
    default: 0,
  })
  event_count: number;

  @Column({
    comment: '开始区块'
  })
  from_block: number;

  @Column({
    comment: '结束区块'
  })
  to_block: number;

  @Column({
    comment: '该任务同步次数(多次同步可保障数据完整性)'
  })
  sync_times: number;

  @Column({
    comment: '创建时间',
    nullable: true,
    select: false,
  })
  created_at: Date;

  @Column({
    comment: '更新时间',
    nullable: true,
  })
  updated_at: Date;
}

/** 同步mp事件任务 */
@Entity('mp_event')
export class MpEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 64,
    comment: '合约地址',
  })
  contract_address: string;

  @Column({
    comment: '监听到的事件数量',
    default: 0,
  })
  event_count: number;

  @Column({
    comment: '开始区块'
  })
  from_block: number;

  @Column({
    comment: '结束区块'
  })
  to_block: number;

  @Column({
    comment: '该任务同步次数(多次同步可保障数据完整性)'
  })
  sync_times: number;

  @Column({
    comment: '创建时间',
    nullable: true,
    select: false,
  })
  created_at: Date;

  @Column({
    comment: '更新时间',
    nullable: true,
  })
  updated_at: Date;
}

/** 记录订单 */
@Entity('order')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    comment: '订单编号',
    unique: true,
  })
  orderIndex: string;

  @Column({
    comment: '订单类别',
  })
  mintType: string;

  @Column({
    length: 64,
    comment: "持有人",
  })
  from: string;

  @Column({
    comment: "订单状态",
  })
  state: string;

  @Column({
    comment: 'MintHash',
    nullable: true,
  })
  mintHash: string;

  @Column({
    comment: 'MintBlock',
    nullable: true,
  })
  mintBlock: number;

  @Column({
    comment: 'handleHash',
    nullable: true,
  })
  handleHash: string;

  @Column({
    comment: 'HandleBlock',
    nullable: true,
  })
  handleBlock: number;

  @Column({
    comment: '创建时间',
    select: false,
    nullable: true,
  })
  created_at: Date;

  @Column({
    comment: '更新时间',
    nullable: true,
  })
  updated_at: Date;
}

/** 记录护照 */
@Entity('passport')
export class Passport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    comment: '护照id',
    unique: true,
  })
  mpTokenId: string;

  @Column({
    comment: '钱包地址',
    unique: true,
  })
  address: string;

  @Column({
    comment: '护照形象',
    nullable: true,
  })
  use: string;

  @Column({
    comment: '创建时间',
    select: false,
    nullable: true,
  })
  created_at: Date;

  @Column({
    comment: '更新时间',
    nullable: true,
  })
  updated_at: Date;
}