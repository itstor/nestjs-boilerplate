/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Column, Entity, ManyToOne } from 'typeorm';

import { DefaultEntity } from './default.entity';
import { User } from './user.entity';

export enum OTPType {
  VERIFY_EMAIL = 'verify_email',
  RESET_PASSWORD = 'reset_password',
}

@Entity('one_time_passwords')
export class OneTimePassword extends DefaultEntity {
  @ManyToOne(() => User, (user) => user.oneTimePasswords, {
    onDelete: 'CASCADE',
  })
  user?: User;

  @Column()
  code!: string;

  @Column({ default: false })
  isRevoked!: boolean;

  @Column()
  type!: OTPType;

  @Column()
  expiredOn!: Date;
}
