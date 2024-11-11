import { IsBoolean, IsEmail, IsEnum, IsString, MaxLength, MinLength } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';
import { Locales, UserRole } from '@dnd-app/core';
import { ResponseBase } from '@dnd-app/dto';

export class UserResponseDto extends ResponseBase {
  @ApiProperty({
    example: `joh-doe@gmail.com`,
    description: `User's email address`,
  })
  @MaxLength(320)
  @MinLength(5)
  @IsEmail()
  @AutoMap()
  @Expose()
  email: string;

  @ApiProperty({
    description: `User's first name`,
    example: 'joh',
  })
  @IsString()
  @MinLength(3)
  @AutoMap()
  @Expose()
  firstName: string;

  @ApiProperty({
    description: `User's last name`,
    example: 'doe',
  })
  @IsString()
  @MinLength(3)
  @AutoMap()
  @Expose()
  lastName: string;

  @ApiProperty({
    description: `User's preferred locale`,
    type: () => Locales,
    enum: Locales,
    example: Locales.EN,
  })
  @IsEnum(Locales)
  @AutoMap(() => String)
  @Expose()
  locale: Locales;

  @ApiProperty({
    description: `User's account type`,
    type: () => UserRole,
    enum: UserRole,
    example: UserRole.USER,
  })
  @IsEnum(UserRole)
  @AutoMap(() => String)
  @Expose()
  type: UserRole;

  @ApiProperty({
    description: `Does user have verified e-mail address?`,
    type: Boolean,
    example: false,
  })
  @IsBoolean()
  @Type(() => Boolean)
  @AutoMap()
  @Expose()
  isEmailVerified: boolean;
}
