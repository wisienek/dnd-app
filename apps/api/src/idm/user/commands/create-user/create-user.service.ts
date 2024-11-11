import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import { InjectMapper } from '@automapper/nestjs';
import { type Mapper } from '@automapper/core';
import { Err, Ok, Result } from 'oxide.ts';
import { type QueryRunner } from 'typeorm';
import { Inject } from '@nestjs/common';
import { omit } from 'lodash';
import { ConflictException } from '@dnd-app/exceptions';
import { type AggregateID } from '@dnd-app/ddd';
import { User } from '@dnd-app/db';
import { CreateUserProps, UserAlreadyExistsError, UserEntity } from '../../domain';
import { CreateUserCommand } from './create-user.command';
import { type UserRepositoryPort } from '../../database';
import { USER_REPOSITORY } from '../../user.di-tokens';

@CommandHandler(CreateUserCommand)
export class CreateUserService implements ICommandHandler {
  constructor(
    @Inject(USER_REPOSITORY)
    protected readonly userRepo: UserRepositoryPort,
    @InjectMapper() private mapper: Mapper
  ) {}

  async execute(command: CreateUserCommand): Promise<Result<AggregateID, UserAlreadyExistsError>> {
    const exists = await this.userRepo.findByEmail(command.email);
    if (exists) {
      return Err(new UserAlreadyExistsError());
    }

    const user = await UserEntity.create(
      omit(command, ['password', 'id', 'metadata']) satisfies CreateUserProps,
      command.password
    );

    try {
      const saved = await this.userRepo.transaction<User>(async (qr: QueryRunner) => {
        return qr.manager.save(User, this.mapper.map(user, UserEntity, User));
      });

      return Ok(saved.id);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new UserAlreadyExistsError(error));
      }
      throw error;
    }
  }
}
