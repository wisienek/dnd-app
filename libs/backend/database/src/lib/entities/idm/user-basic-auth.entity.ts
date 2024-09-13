import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Relation, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserBasicAuth {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => User, (user) => user.basicAuth, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: Relation<User>;

  @Column()
  password: string;
}
