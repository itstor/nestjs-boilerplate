import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

import { IsUsername } from '@/common/validators/is-username.validator';
import { UserRole } from '@/entities/user.entity';

export class UpdateUserDto {
  @ApiPropertyOptional({ minimum: 5, maximum: 12 })
  @Transform(({ value }) => (value as string).toLowerCase().trim())
  @IsUsername()
  @IsOptional()
  readonly username?: string;

  @ApiPropertyOptional()
  @IsEmail()
  @IsOptional()
  @Transform(({ value }) => (value as string).toLowerCase().trim())
  readonly email?: string;

  @ApiPropertyOptional({ minimum: 6, maximum: 128 })
  @MinLength(6)
  @IsOptional()
  @MaxLength(128)
  readonly password?: string;

  @ApiPropertyOptional({ enum: UserRole })
  @IsOptional()
  @IsEnum(UserRole)
  readonly role?: UserRole;
}
