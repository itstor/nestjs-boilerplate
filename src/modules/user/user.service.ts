import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginateConfig } from 'nestjs-paginate';
import { Repository } from 'typeorm';

import { CRUDService } from '@/common/classes/base-crud.service';
import { Users } from '@/entities/users.entity';

@Injectable()
export class UserService extends CRUDService<Users> {
  constructor(
    @InjectRepository(Users) protected readonly repository: Repository<Users>,
  ) {
    const paginationConfig: PaginateConfig<Users> = {
      sortableColumns: ['id', 'email', 'role', 'createdAt', 'updatedAt'],
      nullSort: 'last',
      searchableColumns: ['email', 'username'],
      defaultLimit: 10,
      defaultSortBy: [['id', 'ASC']],
    };

    super(repository, paginationConfig);
  }
}
