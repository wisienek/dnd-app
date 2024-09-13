import { Command, type CommandProps } from '@dnd-app/ddd';
import type { Locales } from '@dnd-app/core';

export class CreateUserCommand extends Command {
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly locale: Locales;
  readonly password: string;

  constructor(props: CommandProps<CreateUserCommand>) {
    super(props);
    this.email = props.email;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.locale = props.locale;
    this.lastName = props.lastName;
  }
}
