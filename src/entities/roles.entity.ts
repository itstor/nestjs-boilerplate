import { Column, Entity } from 'typeorm';

import { DefaultEntity } from './default.entity';

@Entity()
export class Roles extends DefaultEntity {
  @Column()
  name: string;
}
