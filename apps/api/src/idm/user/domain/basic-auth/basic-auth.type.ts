import { PickType } from '@nestjs/swagger';

export class BasicAuthProps {
  id: string;
  password: string;
}

export class CreateBasicAuthProps extends PickType(BasicAuthProps, ['password']) {}
