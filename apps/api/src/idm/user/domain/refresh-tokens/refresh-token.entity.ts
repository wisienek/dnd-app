import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { type AggregateID, AggregateRoot } from '@dnd-app/ddd';
import { ApiConfig } from '@dnd-app/config';
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
        expirationTimestamp: dayjs().add(new ApiConfig().TOKEN_EXPIRATION_HOURS, 'h').toDate(),
        user,
      },
    });
  }

  validate(): void {}
}
