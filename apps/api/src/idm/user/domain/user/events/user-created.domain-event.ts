import { DomainEvent, DomainEventProps } from '@dnd-app/ddd';

export class UserCreatedDomainEvent extends DomainEvent {
  readonly email: string;

  constructor(props: DomainEventProps<UserCreatedDomainEvent>) {
    super(props);
    this.email = props.email;
  }
}
