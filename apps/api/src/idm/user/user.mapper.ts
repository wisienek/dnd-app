import { beforeMap, createMap, forMember, mapFrom, type Mapper, type MappingProfile } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { pick } from 'lodash';
import type { Mapper as DMapper } from '@dnd-app/ddd';
import { User } from '@dnd-app/db';
import type { UserRepositoryPort } from './database';
import { USER_REPOSITORY } from './user.di-tokens';
import { UserResponseDto } from './dto';
import { UserEntity } from './domain';

@Injectable()
export class UserMapper extends AutomapperProfile implements DMapper<UserEntity, User, UserResponseDto> {
  constructor(
    @InjectMapper() mapper: Mapper,
    @Inject(USER_REPOSITORY)
    private userRepository: UserRepositoryPort
  ) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      // toPersistence
      createMap(
        mapper,
        UserEntity,
        User,
        forMember(
          (d) => d.id,
          mapFrom((s) => s.getProps().id)
        ),
        forMember(
          (d) => d.firstName,
          mapFrom((s) => s.getProps().firstName)
        ),
        forMember(
          (d) => d.lastName,
          mapFrom((s) => s.getProps().lastName)
        ),
        forMember(
          (d) => d.email,
          mapFrom((s) => s.getProps().email)
        ),
        forMember(
          (d) => d.locale,
          mapFrom((s) => s.getProps().locale)
        ),
        forMember(
          (d) => d.type,
          mapFrom((s) => s.getProps().type)
        ),
        forMember(
          (d) => d.deletedDate,
          mapFrom((s) => s.getProps().deletedDate)
        ),
        forMember(
          (d) => d.activateToken,
          mapFrom((s) => s.getProps().activateToken)
        ),
        forMember(
          (d) => d.changeEmailToken,
          mapFrom((s) => s.getProps().changeEmailToken)
        ),
        forMember(
          (d) => d.resetPasswordToken,
          mapFrom((s) => s.getProps().resetPasswordToken)
        )
      );

      // toDomain
      createMap(
        mapper,
        User,
        UserEntity,
        beforeMap(async (source, destination) => {
          console.log(`Source mapping`, source);
          const createdUser = await UserEntity.create(
            pick(source, ['firstName', 'lastName', 'email', 'locale']),
            source?.basicAuth?.password
          );
          Object.assign(destination, createdUser);
        })
      );

      // toResponse
      createMap(mapper, UserEntity, UserResponseDto);
    };
  }

  async toPersistence(entity: UserEntity): Promise<User> {
    const mapped = this.mapper.map(entity, UserEntity, User);
    return this.userRepository.insert(mapped);
  }

  toDomain(record: User): UserEntity {
    return this.mapper.map(record, User, UserEntity);
  }

  toResponse(entity: UserEntity): UserResponseDto {
    return this.mapper.map(entity, UserEntity, UserResponseDto);
  }
}
