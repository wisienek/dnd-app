import { PickType } from '@nestjs/swagger';
import { UserEntity } from '../user';

export class BasicAuthProps {
  id: string;
  user: UserEntity;
  password: string;
}

export class CreateBasicAuthProps extends PickType(BasicAuthProps, ['password']) {}
