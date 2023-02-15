import { RedisHealthModule } from '@liaoliaots/nestjs-redis-health';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';

import { HealthCheckController } from './health-check.controller';
import { HealthCheckService } from './health-check.service';

@Module({
  imports: [TerminusModule, RedisHealthModule],
  controllers: [HealthCheckController],
  providers: [HealthCheckService, ConfigService],
})
export class HealthCheckModule {}
