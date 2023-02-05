import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class UserLoginDto {
  @ApiProperty()
  @Transform(({ value }) => (value as string).toLowerCase().trim())
  @IsNotEmpty()
  readonly emailOrUsername!: string;

  @ApiProperty({ minimum: 6, maximum: 128 })
  @IsNotEmpty()
  readonly password!: string;
}
