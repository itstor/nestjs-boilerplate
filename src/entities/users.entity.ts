import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import * as argon2 from 'argon2';
import { Exclude } from 'class-transformer';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';

import { DefaultEntity } from './default.entity';
import LinkedAccounts from './linked-accounts.entity';
import { RefreshTokens } from './resfresh-tokens.entity';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity()
export class Users extends DefaultEntity {
  @Column({ unique: true })
  @ApiProperty()
  email: string;

  @Column({ unique: true })
  @ApiProperty()
  username: string;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  @ApiHideProperty()
  password: string;

  @Column({ default: UserRole.USER })
  @ApiProperty()
  role: UserRole;

  @Column({ default: false })
  @ApiProperty()
  isVerified: boolean;

  @OneToMany(() => RefreshTokens, (refreshToken) => refreshToken.user)
  refreshTokens?: RefreshTokens[];

  @OneToMany(() => LinkedAccounts, (linkedAccounts) => linkedAccounts.user)
  linkedAccounts?: LinkedAccounts[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (!this.password) return;

    this.password = await argon2.hash(this.password, {
      type: argon2.argon2id,
    });
  }
}
