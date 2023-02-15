import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { HealthCheckService } from './health-check.service';

@Controller({
  path: 'health',
})
@ApiTags('Server Health')
export class HealthCheckController {
  constructor(private readonly healthCheckService: HealthCheckService) {}

  @Get()
  @ApiOperation({
    description: 'Check the server health',
    operationId: 'Health',
  })
  @ApiOkResponse({
    description: 'Server status',
  })
  health() {
    return this.healthCheckService.check();
  }

  @Get('ping')
  @ApiOperation({ description: 'Ping the server', operationId: 'Ping' })
  @ApiOkResponse({
    description: 'Server up and running',
  })
  ping() {
    return this.healthCheckService.ping();
  }
}
