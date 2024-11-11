import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { UserResponseDto } from '../../dto';
import { PaginatedQueryRequestDto } from '@dnd-app/dto';

export class FindUsersRequestDto extends IntersectionType(
  PartialType(PickType(UserResponseDto, ['email', 'isEmailVerified', 'firstName', 'lastName'])),
  PaginatedQueryRequestDto
) {}
