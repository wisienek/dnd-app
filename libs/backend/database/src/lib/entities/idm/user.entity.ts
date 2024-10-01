import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { UserBasicAuth } from './user-basic-auth.entity';
import { Locales, UserRole } from '@dnd-app/core';
import { RefreshToken } from './refresh-token.entity';

@Entity()
@Index(['email', 'deletedDate'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column({ type: 'enum', enum: Locales, default: Locales.EN })
  locale: Locales;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
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
  deletedDate: Date;

  // auth
  @OneToOne(() => UserBasicAuth, (auth) => auth.user, { cascade: true })
  basicAuth: Relation<UserBasicAuth>;

  @OneToMany(() => RefreshToken, (token) => token.user, { cascade: true })
  refreshTokens: Relation<RefreshToken>[];
}
