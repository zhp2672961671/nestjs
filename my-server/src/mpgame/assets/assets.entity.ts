import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * 资产数据表
 */
@Entity('assets')
export class Assets {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
    comment: '星球tokenId',
  })
  sphereTokenId: string;

  @Column({
    comment: '淡水',
  })
  1: number;

  @Column({
    comment: '矿石',
  })
  2: number;

  @Column({
    comment: '木头',
  })
  3: number;

  @Column({
    comment: '麦子',
  })
  4: number;

  @Column({
    comment: '钉子',
  })
  5: number;

  @Column({
    comment: '人口',
  })
  6: number;

  @Column({
    comment: '幸福度',
  })
  7: number;

  @Column({
    comment: '学点',
  })
  8: number;

  @Column({
    comment: '空闲',
  })
  9: number;

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