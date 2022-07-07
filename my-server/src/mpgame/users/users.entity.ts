import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/** 用户数据 */
@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
    comment: '钱包地址',
  })
  address: string;

  @Column({
    comment: '头像地址',
    nullable: true,
  })
  avatar: string;

  @Column('simple-array', {
    comment: '身份组信息',
    nullable: true,
  })
  roles: string[];

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

