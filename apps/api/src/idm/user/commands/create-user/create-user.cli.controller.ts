import { Command, Console } from 'nestjs-console';
import { Inject, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Locales, LoggerPort } from '@dnd-app/core';
import { CreateUserCommand } from './create-user.command';

@Console({
  command: 'new',
  description: 'A command to create a user',
})
export class CreateUserCliController {
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(Logger)
    private readonly logger: LoggerPort
  ) {}

  @Command({
    command: 'user <email> <firstName> <lastName> <locale> <password>',
    description: 'Create a user',
  })
  async createUser(
    email: string,
    firstName: string,
    lastName: string,
    locale: Locales,
    password: string
  ): Promise<void> {
    const command = new CreateUserCommand({
      email,
      firstName,
      lastName,
      locale,
      password,
    });

    const result = await this.commandBus.execute(command);

    this.logger.log('User created:', result.unwrap());
  }
}
