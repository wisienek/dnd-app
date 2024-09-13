import { Controller, Delete, HttpStatus, Param, NotFoundException as NotFoundHttpException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { match, Result } from 'oxide.ts';
import { NotFoundException } from '@dnd-app/exceptions';
import { ApiErrorResponse } from '@dnd-app/dto';
import { routesV1 } from '@dnd-app/core';
import { DeleteUserCommand } from './delete-user.command';

@ApiTags('Users')
@Controller({ path: routesV1.users.root, version: routesV1.version })
export class DeleteUserHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({
    description: 'User deleted',
    status: HttpStatus.OK,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: NotFoundException.message,
    type: ApiErrorResponse,
  })
  @Delete(routesV1.users.delete)
  async deleteUser(@Param('id') id: string): Promise<void> {
    const command = new DeleteUserCommand({ userId: id });
    const result: Result<boolean, NotFoundException> = await this.commandBus.execute(command);

    match(result, {
      Ok: (isOk: boolean) => isOk,
      Err: (error: Error) => {
        if (error instanceof NotFoundException) {
          throw new NotFoundHttpException(error.message);
        }
        throw error;
      },
    });
  }
}
