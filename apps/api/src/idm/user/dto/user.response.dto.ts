import { IsBoolean, IsEmail, IsEnum, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Locales, UserRole } from '@dnd-app/core';
import { ResponseBase } from '@dnd-app/dto';
import { AutoMap } from '@automapper/classes';

export class UserResponseDto extends ResponseBase {
  @ApiProperty({
    example: `joh-doe@gmail.com`,
    description: `User's email address`,
  })
  @MaxLength(320)
  @MinLength(5)
  @IsEmail()
  @AutoMap()
  email: string;

  @ApiProperty({
    description: `User's first name`,
    example: 'joh',
  })
  @IsString()
  @MinLength(3)
  @AutoMap()
  firstName: string;

  @ApiProperty({
    description: `User's last name`,
    example: 'doe',
  })
  @IsString()
  @MinLength(3)
  @AutoMap()
  lastName: string;

  @ApiProperty({
    description: `User's preferred locale`,
    type: () => Locales,
    enum: Locales,
    example: Locales.EN,
  })
  @IsEnum(Locales)
  @AutoMap(() => String)
  locale: Locales;

  @ApiProperty({
    description: `User's account type`,
    type: () => UserRole,
    enum: UserRole,
    example: UserRole.USER,
  })
  @IsEnum(UserRole)
  @AutoMap(() => String)
  type: UserRole;

  @ApiProperty({
    description: `Does user have verified e-mail address?`,
    type: Boolean,
    example: false,
  })
  @IsBoolean()
  @Type(() => Boolean)
  @AutoMap()
  isEmailVerified: boolean;
}
