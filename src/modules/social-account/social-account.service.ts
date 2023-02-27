import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginateConfig } from 'nestjs-paginate';
import { Repository } from 'typeorm';

import { CRUDService } from '@/common/classes/base-crud.service';
import SocialAccount from '@/entities/linked-account.entity';

@Injectable()
export class SocialAccountService extends CRUDService<SocialAccount> {
  constructor(
    @InjectRepository(SocialAccount)
    protected readonly repo: Repository<SocialAccount>,
  ) {
    const paginationConfig: PaginateConfig<SocialAccount> = {
      sortableColumns: ['id', 'provider', 'providerAccountId', 'createdAt'],
      nullSort: 'last',
      searchableColumns: ['provider'],
      defaultLimit: 10,
      defaultSortBy: [['id', 'ASC']],
    };

    super(repo, paginationConfig, 'SocialAccount');
  }
}
