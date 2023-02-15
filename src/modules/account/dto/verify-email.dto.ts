import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class VerifyEmailDTO {
  @ApiProperty()
  @IsNotEmpty()
  readonly otp!: string;
}
