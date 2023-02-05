import { Column, Entity, ManyToOne } from 'typeorm';

import { DefaultEntity } from './default.entity';
import { User } from './user.entity';

@Entity('linked_accounts')
export default class LinkedAccount extends DefaultEntity {
  @Column()
  provider: string;

  @Column()
  providerId: string;

  @Column()
  providerAccountId: string;

  @ManyToOne(() => User, (user) => user.linkedAccounts, {
    onDelete: 'CASCADE',
  })
  user: User;
}
