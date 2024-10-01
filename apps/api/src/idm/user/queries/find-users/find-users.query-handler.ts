import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Ok, Result } from 'oxide.ts';
import { Paginated, PaginatedParams, PaginatedQueryBase } from '@dnd-app/ddd';
import { USER_REPOSITORY } from '../../user.di-tokens';
import { UserRepositoryPort } from '../../database';
import { UserMapper } from '../../user.mapper';
import { UserEntity } from '../../domain';

export class FindUsersQuery extends PaginatedQueryBase {
  readonly email?: string;
  readonly isEmailVerified?: boolean;
  readonly firstName?: string;
  readonly lastName?: string;

  constructor(props: PaginatedParams<FindUsersQuery>) {
    super(props);
    this.email = props.email;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.isEmailVerified = props.isEmailVerified;
  }
}

@QueryHandler(FindUsersQuery)
export class FindUsersQueryHandler implements IQueryHandler {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: UserRepositoryPort,
    private readonly usersMapper: UserMapper
  ) {}

  async execute(query: FindUsersQuery): Promise<Result<Paginated<UserEntity>, Error>> {
    const paginatedUsers = await this.userRepo.findAllPaginated(query);

    const entityUsersPaginatedInput = {
      ...paginatedUsers,
      data: paginatedUsers.data.map((d) => this.usersMapper.toDomain(d)),
    } satisfies Paginated<UserEntity>;

    return Ok(new Paginated(entityUsersPaginatedInput));
  }
}
