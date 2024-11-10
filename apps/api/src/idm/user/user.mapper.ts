import { createMap, type Mapper, type MappingProfile } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Inject, Injectable } from '@nestjs/common';
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
      createMap(mapper, UserEntity, User);

      // toDomain
      createMap(mapper, User, UserEntity);

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
