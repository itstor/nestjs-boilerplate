import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateEmailDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => (value as string).toLowerCase().trim())
  readonly newEmail!: string;
}
