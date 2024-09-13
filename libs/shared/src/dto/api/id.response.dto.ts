import { ApiProperty } from '@nestjs/swagger';
import { IsString, NotEquals } from 'class-validator';

export class IdResponse {
  constructor(id: string) {
    this.id = id;
  }

  @ApiProperty({ example: '2cdc8ab1-6d50-49cc-ba14-54e4ac7ec231' })
  @IsString()
  @NotEquals('')
  readonly id: string;
}
