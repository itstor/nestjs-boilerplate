import { Column, Entity, ManyToOne } from 'typeorm';

import { AuthProvider } from '@/common/types/enums/auth-provider.enum';

import { DefaultEntity } from './default.entity';
import { User } from './user.entity';

@Entity('social_accounts')
export default class SocialAccount extends DefaultEntity {
  @Column({ type: 'enum', enum: AuthProvider })
  provider: Exclude<AuthProvider, AuthProvider.LOCAL>;

  @Column()
  providerAccountId: string;

  @ManyToOne(() => User, (user) => user.socialAccounts, {
    onDelete: 'CASCADE',
  })
  user: User;
}
