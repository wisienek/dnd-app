import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { Locales, UserRole } from '@dnd-app/core';
import { RefreshTokenEntity } from '../refresh-tokens';
import { BasicAuthEntity } from '../basic-auth';
import { AutoMap } from '@automapper/classes';

export class UserProps {
  @ApiProperty({
    description: `Generated id`,
  })
  @IsUUID('4')
  @AutoMap()
  id: string;

  @AutoMap()
  firstName: string;

  @AutoMap()
  lastName: string;

  @AutoMap()
  email: string;

  @AutoMap(() => String)
  locale: Locales;

  @AutoMap(() => String)
  type: UserRole;

  @AutoMap()
  isEmailVerified: boolean;

  @AutoMap()
  activateToken?: string;

  @AutoMap()
  resetPasswordToken?: string;

  @AutoMap()
  changeEmailToken?: string;

  @AutoMap()
  deletedDate?: Date;

  @AutoMap(() => BasicAuthEntity)
  basicAuth: BasicAuthEntity;

  @AutoMap(() => [RefreshTokenEntity])
  refreshTokens: RefreshTokenEntity[];
}

export class CreateUserProps extends PickType(UserProps, ['firstName', 'lastName', 'email', 'locale']) {}
