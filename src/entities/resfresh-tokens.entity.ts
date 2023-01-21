/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Column, Entity, ManyToOne } from 'typeorm';

import { DefaultEntity } from './default.entity';
import { Users } from './users.entity';

@Entity()
export class RefreshTokens extends DefaultEntity {
  @ManyToOne(() => Users, (user) => user.refreshTokens, { onDelete: 'CASCADE' })
  user: Users;

  @Column({ default: false })
  isRevoked: boolean;

  @Column()
  expiresIn!: Date;
}
