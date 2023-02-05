/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Column, Entity, ManyToOne } from 'typeorm';

import { DefaultEntity } from './default.entity';
import { User } from './user.entity';

@Entity('refresh_tokens')
export class RefreshToken extends DefaultEntity {
  @ManyToOne(() => User, (user) => user.refreshTokens, { onDelete: 'CASCADE' })
  user: User;

  @Column({ default: false })
  isRevoked: boolean;

  @Column()
  expiredOn!: Date;
}
