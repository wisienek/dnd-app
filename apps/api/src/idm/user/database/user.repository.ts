import { ILike, type QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Option } from 'oxide.ts';
import { Paginated, type PaginatedQueryParams } from '@dnd-app/ddd';
import { DbType } from '@dnd-app/core';
import { User } from '@dnd-app/db';
import type { UserRepositoryPort } from './user.repository.port';

@Injectable()
export class UserRepository implements UserRepositoryPort {
  constructor(
    @InjectRepository(User, DbType.IDM)
    private readonly userRepository: Repository<User>
  ) {}

  async insert(entity: User): Promise<User>;
  async insert(entities: User[]): Promise<User[]>;
  async insert(entity: User | User[]): Promise<User | User[]> {
    if (Array.isArray(entity)) {
      return await this.userRepository.save(entity);
    } else {
      return await this.userRepository.save(entity);
    }
  }

  public async findLikeEmail(email: string): Promise<User[]> {
    return this.userRepository
      .createQueryBuilder('user')
      .where({
        email: ILike(this.getLikeEmail(email)),
      })
      .getMany();
  }

  public async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  public async findAllPaginated(params: PaginatedQueryParams): Promise<Paginated<User>> {
    const [users, count] = await this.userRepository
      .createQueryBuilder('user')
      .limit(params.limit)
      .offset(params.limit * params.page + (params?.offset ?? 0))
      .addOrderBy(params.orderBy.field, params.orderBy.param)
      .getManyAndCount();

    return new Paginated({
      data: users,
      count,
      limit: params.limit,
      page: params.page,
    });
  }

  public async transaction<T>(handler: (qr: QueryRunner) => Promise<T>): Promise<T> {
    const qr = this.userRepository.queryRunner;

    let data: T;
    await qr.connect();
    await qr.startTransaction();

    try {
      data = await handler(qr);
    } catch (error) {
      data = null;
      await qr.rollbackTransaction();
      throw error;
    } finally {
      await qr.release();
    }

    return data;
  }

  public async delete(entity: User): Promise<boolean> {
    return (await this.userRepository.delete(entity.id))?.affected > 0;
  }

  public async findOneById(id: string): Promise<Option<User>> {
    return Option(await this.userRepository.findOneBy({ id }));
  }

  private getLikeEmail(email: string): string {
    return email.split('@').join('%@');
  }
}
