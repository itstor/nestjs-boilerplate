import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class VerifyResetPasswordOTPDTO {
  @ApiProperty()
  @IsNotEmpty()
  readonly otp!: string;
}
