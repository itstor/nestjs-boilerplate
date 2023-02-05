import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

import { IsMatch } from '@/common/validators/is-match.decorator';
import { IsUsername } from '@/common/validators/is-username.validator';

export class UserRegisterDto {
  @ApiProperty({ minimum: 5, maximum: 12 })
  @Transform(({ value }) => (value as string).toLowerCase().trim())
  @IsUsername()
  @IsNotEmpty()
  readonly username!: string;

  @ApiProperty()
  @IsEmail()
  @Transform(({ value }) => (value as string).toLowerCase().trim())
  @IsNotEmpty()
  readonly email!: string;

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
