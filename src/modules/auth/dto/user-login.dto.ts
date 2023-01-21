import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserLoginDto {
  @ApiProperty()
  @IsEmail()
  @Transform(({ value }) => (value as string).toLowerCase().trim())
  @IsNotEmpty()
  readonly email!: string;

  @ApiProperty({ minimum: 6, maximum: 128 })
  @IsNotEmpty()
  readonly password!: string;
}
