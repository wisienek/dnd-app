import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Ok, Result } from 'oxide.ts';
import { ILike } from 'typeorm';
import { Paginated, PaginatedParams, PaginatedQueryBase } from '@dnd-app/ddd';
import { USER_REPOSITORY } from '../../user.di-tokens';
import { UserRepository } from '../../database';
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
    private readonly userRepo: UserRepository,
    private readonly usersMapper: UserMapper
  ) {}

  async execute(query: FindUsersQuery): Promise<Result<Paginated<UserEntity>, Error>> {
    const qb = this.userRepo.createQueryBuilder('user');

    if (query.isEmailVerified) {
      qb.where({ isEmailVerified: true });
    }

    if (query.lastName) {
      qb.andWhere({ lastName: ILike(`%${query.lastName}%`) });
    }

    if (query.firstName) {
      qb.andWhere({ firstName: ILike(`%${query.firstName}%`) });
    }

    if (query.email) {
      qb.andWhere({ email: ILike(`%${query.email}%`) });
    }

    if (query.limit) {
      qb.take(query.limit);
    }

    if (query.page) {
      qb.skip(query.page * (query.limit ?? 10));
    }

    const [users, count] = await qb.getManyAndCount();

    const mapped = users.map((u) => this.usersMapper.toDomain(u));

    return Ok(
      new Paginated({
        data: mapped,
        count,
        limit: query.limit,
        page: query.page,
      })
    );
  }
}
