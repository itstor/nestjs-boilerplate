import {
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
  PureAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';

import { User } from '@/entities/user.entity';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

type Subjects = InferSubjects<typeof User> | 'all';

export type AppAbility = PureAbility<[Action, typeof User]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const {
      can: allow,
      cannot: forbid,
      build,
    } = new AbilityBuilder<PureAbility<[Action, Subjects]>>(
      PureAbility as AbilityClass<AppAbility>,
    );

    if (user.role === 'admin') {
      allow(Action.Manage, 'all'); // read-write access to everything
    } else {
      forbid(Action.Read, 'all'); // read-only access to everything
    }

    forbid(Action.Update, User, {});

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
