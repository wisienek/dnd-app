import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, type Relation, JoinColumn } from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { v4 as uuidv4 } from 'uuid';
import { User } from './user.entity';

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  @AutoMap()
  id: string;

  @Column()
  @AutoMap()
  token: string;

  @Column({ type: 'timestamptz' })
  @AutoMap()
  expirationTimestamp: Date;

  @ManyToOne(() => User, (user) => user.refreshTokens, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn()
  @AutoMap(() => User)
  user: Relation<User>;

  public setToken(): void {
    this.token = uuidv4();
  }
}
