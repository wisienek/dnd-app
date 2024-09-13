import { CommandHandler } from '@nestjs/cqrs';
import { Err, Ok, Result } from 'oxide.ts';
import { Inject } from '@nestjs/common';
import { NotFoundException } from '@dnd-app/exceptions';
import { DeleteUserCommand } from './delete-user.command';
import { USER_REPOSITORY } from '../../user.di-tokens';
import { UserRepository } from '../../database';
import { UserMapper } from '../../user.mapper';

@CommandHandler(DeleteUserCommand)
export class DeleteUserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: UserRepository,
    private readonly userMapper: UserMapper
  ) {}

  async execute(command: DeleteUserCommand): Promise<Result<boolean, NotFoundException>> {
    const found = await this.userRepo.findOneBy({ id: command.userId });
    if (!found) {
      return Err(new NotFoundException());
    }
    const user = this.userMapper.toDomain(found);
    user.delete();
    const result = await this.userRepo.delete(found.id);

    return Ok(result?.affected > 0);
  }
}
