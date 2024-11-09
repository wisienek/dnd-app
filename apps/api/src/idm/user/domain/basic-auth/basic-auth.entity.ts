import { hash, verify } from 'argon2';
import { v4 as uuidv4 } from 'uuid';
import { randomUUID } from 'crypto';
import { type AggregateID, AggregateRoot } from '@dnd-app/ddd';
import type { BasicAuthProps, CreateBasicAuthProps } from './basic-auth.type';

export class BasicAuthEntity extends AggregateRoot<BasicAuthProps> {
  protected readonly _id: AggregateID;

  static async create(data: CreateBasicAuthProps): Promise<BasicAuthEntity> {
    const id = randomUUID();

    const props = {
      id: uuidv4(),
      password: await BasicAuthEntity.hashPassword(data.password),
    } satisfies BasicAuthProps;

    return new BasicAuthEntity({ id, props });
  }

  validate(): void {}

  public async verifyPassword(passwordToCheck: string): Promise<boolean> {
    return verify(this.props.password, passwordToCheck);
  }

  public static async hashPassword(newPassword: string): Promise<string> {
    return hash(newPassword);
  }
}
