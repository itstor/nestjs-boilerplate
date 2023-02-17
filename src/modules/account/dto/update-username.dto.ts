import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

import { IsUsername } from '@/common/validators/is-username.validator';

export class UpdateUsernamelDTO {
  @ApiProperty({ minimum: 5, maximum: 12 })
  @Transform(({ value }) => (value as string).toLowerCase().trim())
  @IsUsername()
  @IsNotEmpty()
  readonly newUsername!: string;
}
