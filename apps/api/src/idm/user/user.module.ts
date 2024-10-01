import { Logger, Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { DbType } from '@dnd-app/core';
import { User } from '@dnd-app/db';
import { FindUsersHttpController, FindUsersQueryHandler } from './queries';
import { USER_REPOSITORY } from './user.di-tokens';
import { UserRepository } from './database';
import { UserMapper } from './user.mapper';
import {
  CreateUserCliController,
  CreateUserHttpController,
  CreateUserMessageController,
  CreateUserService,
  DeleteUserHttpController,
  DeleteUserService,
} from './commands';

const httpControllers = [CreateUserHttpController, DeleteUserHttpController, FindUsersHttpController];

const messageControllers = [CreateUserMessageController];

const cliControllers: Provider[] = [CreateUserCliController];

const commandHandlers: Provider[] = [CreateUserService, DeleteUserService];

const queryHandlers: Provider[] = [FindUsersQueryHandler];

const mappers: Provider[] = [UserMapper];

const repositories: Provider[] = [{ provide: USER_REPOSITORY, useClass: UserRepository }];

const providers: Provider[] = [
  Logger,
  ...cliControllers,
  ...repositories,
  ...commandHandlers,
  ...queryHandlers,
  ...mappers,
];

@Module({
  imports: [TypeOrmModule.forFeature([User], DbType.IDM), CqrsModule],
  controllers: [...httpControllers, ...messageControllers],
  providers: providers,
  exports: providers,
})
export class UserModule {}
