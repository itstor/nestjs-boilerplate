import { Column, Entity, ManyToOne } from 'typeorm';

import { DefaultEntity } from './default.entity';
import { Users } from './users.entity';

@Entity()
export default class LinkedAccounts extends DefaultEntity {
  @Column()
  provider: string;

  @Column()
  providerId: string;

  @Column()
  providerAccountId: string;

  @ManyToOne(() => Users, (user) => user.linkedAccounts, {
    onDelete: 'CASCADE',
  })
  user: Users;
}
