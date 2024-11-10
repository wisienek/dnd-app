import type { DomainEntity as DE } from './entity.base';

export interface Mapper<DomainEntity extends DE<any>, DbRecord, Response = any> {
  toPersistence(entity: DomainEntity): DbRecord | Promise<DbRecord>;
  toDomain(record: DbRecord): DomainEntity | Promise<DomainEntity>;
  toResponse(entity: DomainEntity): Response | Promise<Response>;
}
