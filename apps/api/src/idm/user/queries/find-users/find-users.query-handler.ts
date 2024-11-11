import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Ok, Result } from 'oxide.ts';
import { Paginated, type PaginatedParams, PaginatedQueryBase } from '@dnd-app/ddd';
import { USER_REPOSITORY } from '../../user.di-tokens';
import type { UserRepositoryPort } from '../../database';
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
    const { data: dataToMap } = paginatedUsers;

    const mapped = await Promise.all(dataToMap.map((dbUser) => this.usersMapper.toDomain(dbUser)));

    const entityUsersPaginatedInput = {
      ...paginatedUsers,
      data: mapped,
    } satisfies Paginated<UserEntity>;

    return Ok(new Paginated(entityUsersPaginatedInput));
  }
}
