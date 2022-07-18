import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * 地形数据表
 */
@Entity('geography')
export class Geography {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
    comment: '星球tokenId',
  })
  sphereTokenId: string;

  @Column('simple-array', {
    comment: '地形列表',
    nullable: true,
  })
  geo_list: string[];

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