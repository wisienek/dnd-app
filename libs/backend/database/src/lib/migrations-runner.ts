import { DataSource } from 'typeorm';
import { getConfig } from './db-config';
import { DbType } from '@dnd-app/core';

export const migrationsRunner = async (dbType: DbType) => {
  const dbConfig = getConfig(dbType);

  const connection = await new DataSource({
    ...dbConfig,
    synchronize: false,
    logging: true,
    name: 'MIGRATIONS_CONN',
  }).initialize();

  await connection.runMigrations({ transaction: 'each' });
  await connection.destroy();
};
