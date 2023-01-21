import { ApiProperty } from '@nestjs/swagger';
import { nanoid } from 'nanoid';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

@Entity()
export abstract class DefaultEntity extends BaseEntity {
  @PrimaryColumn('varchar', { length: 21 })
  @ApiProperty()
  id: string;

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

  @BeforeInsert()
  async setId() {
    this.id = nanoid();
  }
}
