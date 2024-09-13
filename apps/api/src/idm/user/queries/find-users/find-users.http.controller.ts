import { Body, Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { QueryBus } from '@nestjs/cqrs';
import { Result } from 'oxide.ts';
import { PaginatedQueryRequestDto } from '@dnd-app/dto';
import { routesV1 } from '@dnd-app/core';
import { Paginated } from '@dnd-app/ddd';
import { FindUsersRequestDto } from './find-users.request.dto';
import { FindUsersQuery } from './find-users.query-handler';
import { UserPaginatedResponseDto } from '../../dto';
import { UserMapper } from '../../user.mapper';
import { UserEntity } from '../../domain';

@ApiTags('Users')
@Controller({ path: routesV1.users.root, version: routesV1.version })
export class FindUsersHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly userMapper: UserMapper
  ) {}

  @Get()
  @ApiOperation({ summary: 'Find users' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserPaginatedResponseDto,
  })
  async findUsers(
    @Body() request: FindUsersRequestDto,
    @Query() queryParams: PaginatedQueryRequestDto
  ): Promise<UserPaginatedResponseDto> {
    const query = new FindUsersQuery({
      ...request,
      limit: queryParams?.limit,
      page: queryParams?.page,
    });
    const result: Result<Paginated<UserEntity>, Error> = await this.queryBus.execute(query);

    const paginated = result.unwrap();

    return new UserPaginatedResponseDto({
      ...paginated,
      data: paginated.data.map((user) => this.userMapper.toResponse(user)),
    });
  }
}
