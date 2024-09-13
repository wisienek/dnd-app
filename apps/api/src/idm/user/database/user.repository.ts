import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DbType } from '@dnd-app/core';
import { User } from '@dnd-app/db';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(
    @InjectRepository(User, DbType.IDM)
    private readonly userRepository: Repository<User>
  ) {
    super(User, userRepository.manager);
  }

  public async findLikeEmail(email: string): Promise<User[]> {
    return this.createQueryBuilder('user')
      .where({
        email: ILike(this.getLikeEmail(email)),
      })
      .getMany();
  }

  private getLikeEmail(email: string): string {
    return email.split('@').join('%@');
  }
}
