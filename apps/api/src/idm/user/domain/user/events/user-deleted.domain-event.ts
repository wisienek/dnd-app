import { DomainEvent, DomainEventProps } from '@dnd-app/ddd';

export class UserDeletedDomainEvent extends DomainEvent {
  constructor(props: DomainEventProps<UserDeletedDomainEvent>) {
    super(props);
  }
}
