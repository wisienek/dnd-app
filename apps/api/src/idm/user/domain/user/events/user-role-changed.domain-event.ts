import { DomainEvent, DomainEventProps } from '@dnd-app/ddd';
import { UserRole } from '@dnd-app/core';

export class UserRoleChangedDomainEvent extends DomainEvent {
  readonly oldRole: UserRole;
  readonly newRole: UserRole;

  constructor(props: DomainEventProps<UserRoleChangedDomainEvent>) {
    super(props);
    this.oldRole = props.oldRole;
    this.newRole = props.newRole;
  }
}
