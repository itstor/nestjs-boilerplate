import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class UpdatePasswordDTO {
  @ApiProperty({ minimum: 6, maximum: 128 })
  @MinLength(6)
  @MaxLength(128)
  @IsNotEmpty()
  readonly oldPassword!: string;

  @ApiProperty({ minimum: 6, maximum: 128 })
  @MinLength(6)
  @MaxLength(128)
  @IsNotEmpty()
  readonly newPassword!: string;
}
