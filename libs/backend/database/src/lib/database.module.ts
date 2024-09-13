import { Global, Logger, Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbType } from '@dnd-app/core';
import { migrationsRunner } from './migrations-runner';
import { getConfig } from './db-config';
import 'pg';

@Global()
@Module({
  imports: [TypeOrmModule.forRoot(getConfig(DbType.IDM)), TypeOrmModule.forRoot(getConfig(DbType.APP))],
})
export class DataBaseModule implements OnModuleInit {
  private readonly logger = new Logger(DataBaseModule.name);

  async onModuleInit() {
    for (const dbType of [DbType.IDM, DbType.APP]) {
      this.logger.log(`Running migrations on ${dbType}...`);

      await migrationsRunner(dbType);

      this.logger.log(`Finished migrations!`);
    }
  }
}
