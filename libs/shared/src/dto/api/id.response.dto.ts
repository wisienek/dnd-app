import { IsString, NotEquals } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';
import { Expose } from 'class-transformer';

export const ID_RESPONSE_INCLUDE_GROUP = 'id.response';

export class IdResponse {
  constructor(id: string) {
    this.id = id;
  }

  @ApiProperty({ example: '2cdc8ab1-6d50-49cc-ba14-54e4ac7ec231' })
  @IsString()
  @NotEquals('')
  @AutoMap()
  @Expose({ groups: [ID_RESPONSE_INCLUDE_GROUP] })
  readonly id: string;
}
