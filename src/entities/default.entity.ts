import { ApiProperty } from '@nestjs/swagger';
import { nanoid } from 'nanoid';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

export abstract class DefaultEntity extends BaseEntity {
  @PrimaryColumn('varchar', { length: 21 })
  @ApiProperty()
  id: string = nanoid();

  @Column()
  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;

  @Column({
    nullable: true,
  })
  @DeleteDateColumn()
  @ApiProperty()
  deletedAt?: Date | null;

  @Column()
  @VersionColumn()
  @ApiProperty()
  _v: number;
}
