import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RecoverPasswordDTO {
  @ApiProperty()
  @Transform(({ value }) => (value as string).toLowerCase().trim())
  @IsEmail()
  @IsNotEmpty()
  readonly email!: string;
}
