import type { UserEntity } from '../user';

export class RefreshTokenProps {
  id: string;
  token: string;
  expirationTimestamp: Date;
  user: UserEntity;
}
