import { ApiProperty } from '@nestjs/swagger';
import { IdResponse } from './id.response.dto';
import { AutoMap } from '@automapper/classes';
import { Expose } from 'class-transformer';

export interface BaseResponseProps {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export const DATES_INCLUDE_GROUP = 'response-base.dates';

/**
 * Most of our response objects will have properties like
 * id, createdAt and updatedAt so we can move them to a
 * separate class and extend it to avoid duplication.
 */
export class ResponseBase extends IdResponse {
  constructor(props: BaseResponseProps) {
    super(props?.id ?? '');
    if (props?.createdAt) {
      this.createdAt = new Date(props.createdAt).toISOString();
    }

    if (props?.updatedAt) {
      this.updatedAt = new Date(props.updatedAt).toISOString();
    }
  }

  @ApiProperty({ example: '2020-11-24T17:43:15.970Z' })
  @AutoMap()
  @Expose({ groups: [DATES_INCLUDE_GROUP] })
  readonly createdAt: string;

  @ApiProperty({ example: '2020-11-24T17:43:15.970Z' })
  @AutoMap()
  @Expose({ groups: [DATES_INCLUDE_GROUP] })
  readonly updatedAt: string;
}
