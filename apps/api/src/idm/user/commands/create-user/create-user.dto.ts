import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';
import { UserResponseDto } from '../../dto';

export class CreateUserRequestDto extends PickType(UserResponseDto, ['email', 'firstName', 'lastName', 'locale']) {
  @ApiProperty({
    description: `User's password`,
  })
  @MinLength(3)
  @IsString()
  password: string;
}
