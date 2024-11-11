import { createMap, forMember, mapFrom, type Mapper, type MappingProfile } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import type { Mapper as DMapper } from '@dnd-app/ddd';
import { User } from '@dnd-app/db';
import { CreateUserProps, UserEntity } from './domain';
import type { UserRepositoryPort } from './database';
import { USER_REPOSITORY } from './user.di-tokens';
import { UserResponseDto } from './dto';
import { ID_RESPONSE_INCLUDE_GROUP } from '@dnd-app/dto';

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
    };
  }

  async toPersistence(entity: UserEntity): Promise<User> {
    const mapped = this.mapper.map(entity, UserEntity, User);
    return this.userRepository.insert(mapped);
  }

  async toDomain(record: User): Promise<UserEntity> {
    return UserEntity.create(
      plainToInstance(CreateUserProps, record, { excludeExtraneousValues: true, exposeUnsetFields: false }),
      record?.basicAuth?.password ?? ''
    );
  }

  toResponse(entity: UserEntity): UserResponseDto {
    return plainToInstance(UserResponseDto, entity.getProps(), {
      excludeExtraneousValues: true,
      exposeUnsetFields: true,
      groups: [ID_RESPONSE_INCLUDE_GROUP],
    });
  }
}
