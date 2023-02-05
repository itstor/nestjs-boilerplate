import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

import { IsUsername } from '@/common/validators/is-username.validator';
import { UserRole } from '@/entities/user.entity';

export class CreateUserDto {
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

  @ApiPropertyOptional({ enum: UserRole })
  @IsOptional()
  @IsEnum(UserRole)
  readonly role?: UserRole;
}
