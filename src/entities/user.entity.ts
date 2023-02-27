import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';

import { HashUtils } from '@/common/helpers/hash.utils';
import { AuthProvider } from '@/common/types/enums/auth-provider.enum';

import { DefaultEntity } from './default.entity';
import SocialAccount from './linked-account.entity';
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

  @Column({ type: 'text', nullable: true })
  @Exclude({ toPlainOnly: true })
  @ApiHideProperty()
  password: string | null;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  @ApiProperty()
  role: UserRole;

  @Column({ default: false })
  @ApiProperty()
  isEmailVerified: boolean;

  @Column({
    type: 'enum',
    enum: AuthProvider,
    default: AuthProvider.LOCAL,
  })
  signUpMethod: AuthProvider;

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens?: RefreshToken[];

  @OneToMany(() => SocialAccount, (socialAccounts) => socialAccounts.user)
  socialAccounts?: SocialAccount[];

  @OneToMany(() => OTP, (otp) => otp.user)
  oneTimePasswords?: OTP[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await HashUtils.hashPassword(this.password);
    }
  }
}
