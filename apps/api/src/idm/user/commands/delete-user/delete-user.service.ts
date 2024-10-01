import { CommandHandler } from '@nestjs/cqrs';
import { Err, Ok, Result } from 'oxide.ts';
import { Inject } from '@nestjs/common';
import { NotFoundException } from '@dnd-app/exceptions';
import { DeleteUserCommand } from './delete-user.command';
import { USER_REPOSITORY } from '../../user.di-tokens';
import { UserRepositoryPort } from '../../database';
import { UserMapper } from '../../user.mapper';

@CommandHandler(DeleteUserCommand)
export class DeleteUserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: UserRepositoryPort,
    private readonly userMapper: UserMapper
  ) {}

  async execute(command: DeleteUserCommand): Promise<Result<boolean, NotFoundException>> {
    const found = await this.userRepo.findOneById(command.userId);
    if (!found.isSome()) {
      return Err(new NotFoundException());
    }
    const unwrapped = found.unwrap();

    const user = this.userMapper.toDomain(unwrapped);
    user.delete();
    const result = await this.userRepo.delete(unwrapped);

    return Ok(result);
  }
}
