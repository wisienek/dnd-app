import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Err, Ok, Result } from 'oxide.ts';
import { Inject } from '@nestjs/common';
import { omit } from 'lodash';
import { ConflictException } from '@dnd-app/exceptions';
import { AggregateID } from '@dnd-app/ddd';
import { CreateUserProps, UserAlreadyExistsError, UserEntity } from '../../domain';
import { CreateUserCommand } from './create-user.command';
import { USER_REPOSITORY } from '../../user.di-tokens';
import { UserRepository } from '../../database';

@CommandHandler(CreateUserCommand)
export class CreateUserService implements ICommandHandler {
  constructor(
    @Inject(USER_REPOSITORY)
    protected readonly userRepo: UserRepository
  ) {}

  async execute(command: CreateUserCommand): Promise<Result<AggregateID, UserAlreadyExistsError>> {
    const user = await UserEntity.create(omit(command, ['password']) satisfies CreateUserProps, command.password);

    try {
      await this.userRepo.createQueryBuilder().useTransaction(true).insert().values(user).execute();
      return Ok(user.id);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new UserAlreadyExistsError(error));
      }
      throw error;
    }
  }
}
