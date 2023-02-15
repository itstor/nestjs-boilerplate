/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { RedisHealthIndicator } from '@liaoliaots/nestjs-redis-health';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  HealthCheckService as TerminusHealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { Redis } from 'ioredis';

import { ConfigName } from '@/common/constants/config-name.constant';
import { IRedisConfig } from '@/lib/config/configs/redis.config';

@Injectable()
export class HealthCheckService {
  private readonly redis: Redis;

  constructor(
    private readonly terminusHealth: TerminusHealthCheckService,
    private readonly dbHealth: TypeOrmHealthIndicator,
    private readonly redisHealth: RedisHealthIndicator,
    private readonly configService: ConfigService,
  ) {
    const redisConfig = this.configService.get<IRedisConfig>(ConfigName.REDIS);

    this.redis = new Redis(redisConfig!.redis_url);
  }

  public async ping() {
    return 'pong';
  }

  public async check() {
    return this.terminusHealth.check([
      async () => this.dbHealth.pingCheck('database'),
      async () =>
        this.redisHealth.checkHealth('redis', {
          type: 'redis',
          client: this.redis,
        }),
    ]);
  }
}
