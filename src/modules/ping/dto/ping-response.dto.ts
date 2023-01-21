import { ApiProperty } from '@nestjs/swagger';

export class PingResponseDto {
  @ApiProperty({ example: 'pong' })
  readonly message: string;
}
