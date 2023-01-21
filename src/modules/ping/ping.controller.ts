import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { PingResponseDto } from './dto/ping-response.dto';
import { PingService } from './ping.service';

@Controller({
  path: 'ping',
})
@ApiTags('Server Health')
export class PingController {
  constructor(private readonly pingService: PingService) {}

  @Get()
  @ApiOperation({ description: 'Ping the server', operationId: 'Ping' })
  @ApiOkResponse({
    description: 'Server up and running',
    type: PingResponseDto,
  })
  ping() {
    return this.pingService.ping();
  }
}
