import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { Locales, UserRole } from '@dnd-app/core';
import { RefreshTokenEntity } from '../refresh-tokens';
import { BasicAuthEntity } from '../basic-auth';
import { AutoMap } from '@automapper/classes';
import { Exclude, Expose } from 'class-transformer';

export class UserProps {
  @ApiProperty({
    description: `Generated id`,
  })
  @IsUUID('4')
  @AutoMap()
  @Expose()
  id: string;

  @AutoMap()
  @Expose()
  firstName: string;

  @AutoMap()
  @Expose()
  lastName: string;

  @AutoMap()
  @Expose()
  email: string;

  @AutoMap(() => String)
  @Expose()
  locale: Locales;

  @AutoMap(() => String)
  @Expose()
  type: UserRole;

  @AutoMap()
  @Expose()
  isEmailVerified: boolean;

  @AutoMap()
  @Exclude()
  activateToken?: string;

  @AutoMap()
  @Exclude()
  resetPasswordToken?: string;

  @AutoMap()
  @Exclude()
  changeEmailToken?: string;

  @AutoMap()
  @Exclude()
  deletedDate?: Date;

  @AutoMap(() => BasicAuthEntity)
  @Exclude()
  basicAuth: BasicAuthEntity;

  @AutoMap(() => [RefreshTokenEntity])
  @Exclude()
  refreshTokens: RefreshTokenEntity[];
}

export class CreateUserProps extends PickType(UserProps, ['firstName', 'lastName', 'email', 'locale']) {}
