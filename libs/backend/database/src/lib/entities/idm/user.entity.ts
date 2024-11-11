import { AutoMap } from '@automapper/classes';
import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { Locales, UserRole } from '@dnd-app/core';
import { UserBasicAuth } from './user-basic-auth.entity';
import { RefreshToken } from './refresh-token.entity';

@Entity()
@Index(['email', 'deletedDate'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  @AutoMap()
  id: string;

  @Column()
  @AutoMap()
  firstName: string;

  @Column()
  @AutoMap()
  lastName: string;

  @Column()
  @AutoMap()
  email: string;

  @Column({ type: 'enum', enum: Locales, default: Locales.EN })
  @AutoMap(() => String)
  locale: Locales;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  @AutoMap(() => String)
  type: UserRole;

  // Verification
  @Column({ type: 'boolean', default: false })
  isEmailVerified: boolean;

  @Column({ nullable: true })
  activateToken?: string;

  @Column({ nullable: true })
  resetPasswordToken?: string;

  @Column({ nullable: true })
  changeEmailToken?: string;

  @DeleteDateColumn()
  @AutoMap()
  deletedDate?: Date;

  // auth
  @OneToOne(() => UserBasicAuth, (auth) => auth.user, { cascade: true })
  basicAuth: Relation<UserBasicAuth>;

  @OneToMany(() => RefreshToken, (token) => token.user, { cascade: true })
  @AutoMap(() => [RefreshToken])
  refreshTokens: Relation<RefreshToken>[];
}
