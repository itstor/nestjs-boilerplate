import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ResendForgotPasswordDTO {
  @ApiProperty()
  @IsNotEmpty()
  readonly token!: string;
}
