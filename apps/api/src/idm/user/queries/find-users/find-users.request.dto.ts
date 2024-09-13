import { PartialType, PickType } from '@nestjs/swagger';
import { UserResponseDto } from '../../dto';

export class FindUsersRequestDto extends PartialType(
  PickType(UserResponseDto, ['email', 'isEmailVerified', 'firstName', 'lastName'])
) {}
