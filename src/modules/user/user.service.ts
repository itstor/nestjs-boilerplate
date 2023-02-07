import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginateConfig } from 'nestjs-paginate';
import { Repository } from 'typeorm';

import { CRUDService } from '@/common/classes/base-crud.service';
import { User } from '@/entities/user.entity';

@Injectable()
export class UserService extends CRUDService<User> {
  constructor(
    @InjectRepository(User) protected readonly userRepo: Repository<User>,
  ) {
    const paginationConfig: PaginateConfig<User> = {
      sortableColumns: ['id', 'email', 'role', 'createdAt', 'updatedAt'],
      nullSort: 'last',
      searchableColumns: ['email', 'username'],
      defaultLimit: 10,
      defaultSortBy: [['id', 'ASC']],
    };

    super(userRepo, paginationConfig, 'User');
  }
}
