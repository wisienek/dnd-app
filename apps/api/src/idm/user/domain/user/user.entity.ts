import { v4 as uuidv4 } from 'uuid';
import { randomUUID } from 'crypto';
import { type AggregateID, AggregateRoot } from '@dnd-app/ddd';
import { UserRole } from '@dnd-app/core';
import { UserCreatedDomainEvent, UserDeletedDomainEvent, UserRoleChangedDomainEvent } from './events';
import type { CreateUserProps, UserProps } from './user.type';
import { BasicAuthEntity } from '../basic-auth';

export class UserEntity extends AggregateRoot<UserProps> {
  protected readonly _id: AggregateID;

  static async create(create: CreateUserProps, password: string): Promise<UserEntity> {
    const id = randomUUID();

    const basicAuth = await BasicAuthEntity.create({ password });

    const props = {
      ...create,
      id: uuidv4(),
      type: UserRole.USER,
      isEmailVerified: false,
      deletedDate: undefined,
      basicAuth: basicAuth,
      refreshTokens: [],
    } satisfies UserProps;

    const user = new UserEntity({ id, props });

    basicAuth.setUser(user);

    user.addEvent(
      new UserCreatedDomainEvent({
        aggregateId: id,
        email: props.email,
      })
    );

    return user;
  }

  get type(): UserRole {
    return this.props.type;
  }

  private changeType(newType: UserRole): void {
    this.addEvent(
      new UserRoleChangedDomainEvent({
        aggregateId: this.id,
        oldRole: this.props.type,
        newRole: newType,
      })
    );

    this.props.type = newType;
  }

  makeAdmin(): void {
    this.changeType(UserRole.ADMIN);
  }

  delete(): void {
    this.addEvent(
      new UserDeletedDomainEvent({
        aggregateId: this.id,
      })
    );
  }

  validate(): void {
    // entity business rules validation to protect it's invariant before saving entity to a database
  }
}
