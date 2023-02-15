import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

import { IsMatch } from '@/common/validators/is-match.decorator';

export class ResetForgotPasswordDTO {
  @ApiProperty()
  @IsNotEmpty()
  readonly token!: string;

  @ApiProperty({ minimum: 6, maximum: 128 })
  @MinLength(6)
  @MaxLength(128)
  @IsNotEmpty()
  readonly password!: string;

  @ApiProperty({ minimum: 6, maximum: 128 })
  @IsMatch('password', {
    message: 'Password confirmation does not match password',
  })
  @MinLength(6)
  @MaxLength(128)
  @IsNotEmpty({ message: 'Password confirmation is required' })
  readonly passwordConfirmation!: string;
}
