import type { TypeormRepositoryPort } from '@dnd-app/ddd';
import { User } from '@dnd-app/db';

export interface UserRepositoryPort extends TypeormRepositoryPort<User> {
  findByEmail(email: string): Promise<User | null>;
}
