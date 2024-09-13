import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsPositive, IsString, NotEquals, ValidateNested } from 'class-validator';

export class ApiErrorResponse {
  @ApiProperty({ examples: [400, 500], type: Number, required: true, description: 'Error code' })
  @IsNumber()
  @IsPositive()
  readonly statusCode: number;

  @ApiProperty({ example: ['Validation Error', 'User has not provided ...'], type: String, required: true })
  @IsString()
  @NotEquals('')
  readonly message: string;

  @ApiProperty({ example: 'Bad Request', type: String, required: true })
  @IsString()
  @NotEquals('')
  readonly error: string;

  @ApiProperty({ example: 'YevPQs', description: 'Correlation id of a request' })
  @IsString()
  @NotEquals('')
  readonly correlationId: string;

  @ApiProperty({
    example: ['incorrect email'],
    description: 'Optional list of sub-errors',
    nullable: true,
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested()
  @IsString({ each: true })
  readonly subErrors?: string[];

  constructor(body: ApiErrorResponse) {
    this.statusCode = body.statusCode;
    this.message = body.message;
    this.error = body.error;
    this.correlationId = body.correlationId;
    this.subErrors = body.subErrors;
  }
}
