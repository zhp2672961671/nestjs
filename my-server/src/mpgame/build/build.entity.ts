import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * 建筑数据表
 */
@Entity('build')
export class Build {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    comment: '星球tokenId',
  })
  sphereTokenId: string;

  @Column({
    comment: '建筑类型id',
  })
  typeId: number;

  @Column({
    comment: '建筑类型',
  })
  type: number;

  @Column({
    comment: '等级',
    default: 1,
  })
  level: number;

  @Column({
    comment: '开启标记',
    default: false,
  })
  open: boolean;
 
  @Column({
    comment: '建造时间',
  })
  start_time: number;

  @Column({
    comment: '工作时间',
  })
  work_time: number;

  @Column({
    comment: '收获时间',
  })
  farm_time: number;

  @Column({
    comment: '网格X',
  })
  gridX: number;

  @Column({
    comment: '网格Y',
  })
  gridY: number;

  @Column({
    comment: '网格形态',
  })
  typeGrid: number;

  @Column({
    comment: '建筑形态',
  })
  behaviorId: number;

  /** 人口 */
  @Column({
    comment: '人口',
    default: 0,
  })
  pop: number;

  /** 资源类 */
  @Column({
    comment: '资源',
    default: 0,
  })
  res: number;

  @Column({
    comment: '工位',
    default: 0,
  })
  slot: number;

  /** 仓储 */
  @Column('simple-array', {
    comment: '仓库物',
    nullable: true,
  })
  repo_list: any[];

  /** 图书馆 */
  @Column({
    comment: '学习点',
    default: 0,
  })
  point: number;

  @Column({
    comment: '创建时间',
    select: false,
  })
  created_at: Date;

  @Column({
    comment: '修改时间',
  })
  updated_at: Date;
}



