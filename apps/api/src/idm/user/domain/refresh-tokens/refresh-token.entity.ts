import { v4 as uuidv4 } from 'uuid';
import { AggregateID, AggregateRoot } from '@dnd-app/ddd';
import { RefreshTokenProps } from './refresh-token.type';
import { UserEntity } from '../user';

export class RefreshTokenEntity extends AggregateRoot<RefreshTokenProps> {
  protected readonly _id: AggregateID;

  public static create(user: UserEntity): RefreshTokenEntity {
    const id = uuidv4();
    return new RefreshTokenEntity({
      id,
      props: {
        id,
        token: uuidv4(),
        expirationTimestamp: undefined,
        user,
      },
    });
  }

  validate(): void {}
}
