import { Logger } from '@nestjs/common';
import { UniqueViolationError, wrapError } from 'db-errors';
import { paginate, PaginateConfig, PaginateQuery } from 'nestjs-paginate';
import { err, ok, Result } from 'neverthrow';
import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  TypeORMError,
} from 'typeorm';

import { DefaultEntity } from '@/entities/default.entity';

import { CRUDException } from '../exceptions/crud-service.exception';

export class CRUDService<T extends DefaultEntity> {
  constructor(
    protected readonly repo: Repository<T>,
    private readonly paginationConfig: PaginateConfig<T>,
    private readonly entityName: string,
  ) {}

  private readonly logger: Logger = new Logger(
    `${CRUDService.name}<${this.entityName}>`,
  );

  protected handleError(e: any) {
    if (e instanceof TypeORMError) {
      const code = wrapError(e);

      if (code instanceof UniqueViolationError) {
        return new CRUDException<T>('EXISTS', e, code.columns[0] as any);
      }
    }

    this.logger.error(e);

    return new CRUDException<T>('UNKNOWN', e);
  }

  /**
   * Find with result more than one entity.
   * @param options Options that will be used to find entities.
   * @returns List of entities with metadata or empty list if entities were not found.
   */
  public async findMany(options: PaginateQuery) {
    const data = await paginate<T>(options, this.repo, this.paginationConfig);

    return data;
  }

  /**
   * Find entity by id.
   * @param id Id of entity that will be found.
   * @returns Entity or null if entity was not found.
   */
  public async findOne(
    where: FindOptionsWhere<T>,
    options: Omit<FindOneOptions<T>, 'where'> = {},
  ) {
    const entity = await this.repo.findOne({ where, ...options });

    return entity;
  }

  /**
   * Update entity.
   * @param id Id of entity that will be updated.
   * @param data Data that will be used to update entity.
   * @returns Result of operation. It can be updated entity or error if entity was not updated.
   */
  public async update(
    id: any,
    data: DeepPartial<T>,
  ): Promise<Result<T, CRUDException<T>>> {
    const entity = await this.repo.findOne({ where: { id: id } });

    if (!entity) return err(new CRUDException<T>('NOT_FOUND'));

    try {
      const result = await this.repo.save(Object.assign(entity, data));

      return ok(result);
    } catch (e) {
      return err(this.handleError(e));
    }
  }

  /**
   * Create new entity.
   * @param data Data that will be used to create new entity.
   * @returns Result of operation. It can be created entity or error if entity was not created.
   */
  public async create(
    data: DeepPartial<T>,
  ): Promise<Result<T, CRUDException<T>>> {
    try {
      const result = await this.repo.save(this.repo.create(data));

      return ok(result);
    } catch (e) {
      return err(this.handleError(e));
    }
  }

  /**
   * Delete entity that matches given options.
   * @param options Options that define how entity will be deleted.
   * @returns Result of operation. It can be null if entity was deleted or error if entity was not found.
   */
  public async delete(
    options: FindOptionsWhere<T>,
  ): Promise<Result<null, CRUDException<T>>> {
    if (!(await this.repo.findOne({ where: options })))
      return err(new CRUDException<T>('NOT_FOUND'));

    await this.repo.delete(options);

    return ok(null);
  }

  /**
   * Count all entities that match given options.
   * @param options Options that define how entities will be counted.
   * @returns Number of entities that match given options.
   */
  public async count(options?: FindManyOptions<T>) {
    return await this.repo.count(options);
  }
}
