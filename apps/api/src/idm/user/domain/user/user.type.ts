import { IsString, IsUUID, MinLength, NotEquals } from 'class-validator';
import { ApiProperty, PickType } from '@nestjs/swagger';
import type { Locales, UserRole } from '@dnd-app/core';
import type { RefreshTokenEntity } from '../refresh-tokens';
import type { BasicAuthEntity } from '../basic-auth';

export class UserProps {
  @ApiProperty({
    description: `Generated id`,
  })
  @IsUUID('4')
  id: string;

  firstName: string;
  lastName: string;
  email: string;
  locale: Locales;
  type: UserRole;
  isEmailVerified: boolean;
  activateToken?: string;
  resetPasswordToken?: string;
  changeEmailToken?: string;
  deletedDate: Date;
  basicAuth: BasicAuthEntity;
  refreshTokens: RefreshTokenEntity[];
}

export class CreateUserProps extends PickType(UserProps, ['firstName', 'lastName', 'email', 'locale']) {}
