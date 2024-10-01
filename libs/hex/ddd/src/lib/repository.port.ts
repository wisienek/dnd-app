import type { QueryRunner } from 'typeorm';
import type { Option } from 'oxide.ts';
import type { Paginated, PaginatedQueryParams } from '@dnd-app/ddd';
import { User } from '@dnd-app/db';

export interface RepositoryPort<Entity> {
  insert(entity: User): Promise<User>;
  insert(entities: User[]): Promise<User[]>;
  insert(entity: Entity | Entity[]): Promise<Entity | Entity[]>;

  findOneById(id: string): Promise<Option<Entity>>;
  findAll(): Promise<Entity[]>;
  findAllPaginated(params: PaginatedQueryParams): Promise<Paginated<Entity>>;
  delete(entity: Entity): Promise<boolean>;

  transaction<T>(handler: () => Promise<T>): Promise<T>;
}

export interface TypeormRepositoryPort<Entity> extends RepositoryPort<Entity> {
  transaction<T>(handler: (qr: QueryRunner) => Promise<T>): Promise<T>;
}
