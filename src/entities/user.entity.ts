import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';

import { HashUtils } from '@/common/helpers/hash.utils';

import { DefaultEntity } from './default.entity';
import LinkedAccount from './linked-account.entity';
import { OTP } from './otp.entity';
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

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  @ApiProperty()
  role: UserRole;

  @Column({ default: false })
  @ApiProperty()
  isVerified: boolean;

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens?: RefreshToken[];

  @OneToMany(() => LinkedAccount, (linkedAccounts) => linkedAccounts.user)
  linkedAccounts?: LinkedAccount[];

  @OneToMany(() => OTP, (otp) => otp.user)
  oneTimePasswords?: OTP[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    this.password = await HashUtils.hashPassword(this.password);
  }
}
