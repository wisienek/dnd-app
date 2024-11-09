import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { Inject, Injectable } from '@nestjs/common';
import type { Mapper as DMapper } from '@dnd-app/ddd';
import { User } from '@dnd-app/db';
import { BasicAuthEntity, RefreshTokenEntity, UserEntity } from './domain';
import { USER_REPOSITORY } from './user.di-tokens';
import type { UserRepositoryPort } from './database';
import { UserResponseDto } from './dto';

@Injectable()
export class UserMapper extends AutomapperProfile implements DMapper<UserEntity, User, UserResponseDto> {
  constructor(
    @InjectMapper() private mapper: Mapper,
    @Inject(USER_REPOSITORY)
    private userRepository: UserRepositoryPort
  ) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return (mapper) => {
      // toPersistence
      createMap(mapper, UserEntity, User);

      // toDomain
      createMap(mapper, User, UserEntity);

      // toResponse
      createMap(mapper, UserEntity, UserResponseDto);
    };
  }

  async toPersistence(entity: UserEntity): Promise<User> {
    const copy = entity.getProps();
    const record: User = {
      basicAuth: undefined, // copy.basicAuth,
      refreshTokens: [], // copy.refreshTokens
      deletedDate: copy.deletedDate,
      firstName: copy.firstName,
      isEmailVerified: copy.isEmailVerified,
      lastName: copy.lastName,
      locale: copy.locale,
      id: copy.id,
      email: copy.email,
      type: copy.type,
    };

    return this.userRepository.insert(record);
  }

  toDomain(record: User): UserEntity {
    return new UserEntity({
      id: record.id,
      props: {
        email: record.email,
        type: record.type,
        id: record.id,
        firstName: record.firstName,
        lastName: record.lastName,
        locale: record.locale,
        isEmailVerified: record.isEmailVerified,
        deletedDate: record.deletedDate,
        basicAuth: new BasicAuthEntity({
          id: record.basicAuth.id,
          props: { password: record.basicAuth.password, id: record.basicAuth.id, user: undefined },
        }),
        refreshTokens: record.refreshTokens.map(
          (i) =>
            new RefreshTokenEntity({
              id: i.id,
              props: {
                id: i.id,
                token: i.token,
                expirationTimestamp: i.expirationTimestamp,
                user: undefined,
              },
            })
        ),
      },
    });
  }

  toResponse(entity: UserEntity): UserResponseDto {
    const props = entity.getProps();

    const response = new UserResponseDto(entity);
    response.email = props.email;
    response.firstName = props.firstName;
    response.lastName = props.lastName;
    response.locale = props.locale;
    response.type = props.type;
    response.isEmailVerified = props.isEmailVerified;

    return response;
  }
}
