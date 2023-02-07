import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import * as argon2 from 'argon2';
import { Exclude } from 'class-transformer';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';

import { DefaultEntity } from './default.entity';
import LinkedAccount from './linked-account.entity';
import { OneTimePassword } from './one-time-password.entity';
import { RefreshToken } from './resfresh-token.entity';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity('users')
export class User extends DefaultEntity {
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

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens?: RefreshToken[];

  @OneToMany(() => LinkedAccount, (linkedAccounts) => linkedAccounts.user)
  linkedAccounts?: LinkedAccount[];

  @OneToMany(() => OneTimePassword, (otp) => otp.user)
  oneTimePasswords?: OneTimePassword[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    this.password = await argon2.hash(this.password, {
      type: argon2.argon2id,
    });
  }
}
