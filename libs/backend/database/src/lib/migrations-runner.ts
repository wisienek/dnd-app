import { DataSource } from 'typeorm';
import { DatabaseLogger } from '@dnd-app/be-logger';
import { DbType } from '@dnd-app/core';
import { getConfig } from './db-config';

export const migrationsRunner = async (dbType: DbType) => {
  const dbConfig = getConfig(dbType);

  const connection = await new DataSource({
    logger: DatabaseLogger.create(`DB-${dbType}`),
    ...dbConfig,
    synchronize: false,
    logging: true,
    name: 'MIGRATIONS_CONN',
  }).initialize();

  await connection.runMigrations({ transaction: 'each' });
  await connection.destroy();
};
