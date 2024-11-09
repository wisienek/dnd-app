import type { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import type { DataSourceOptions } from 'typeorm';
import { join } from 'path';
import { DatabaseSchema } from '@dnd-app/config';
import { DbType } from '@dnd-app/core';
import { RefreshToken, User, UserBasicAuth } from './entities/idm';
import { InitialMigration1727789756173 } from './migrations/idm';

const getDefaultConfig = (): PostgresConnectionOptions => {
  const config = DatabaseSchema.parse(process.env);

  return {
    type: 'postgres',
    host: config.DB_HOST,
    port: config.DB_PORT,
    username: config.DB_USERNAME,
    password: config.DB_PASSWORD,
    schema: 'public',
    migrationsTableName: 'migrations',
  };
};

export const getConfig = (type: DbType): DataSourceOptions => {
  const defaultConfig = getDefaultConfig();

  switch (type) {
    case DbType.APP: {
      return {
        ...defaultConfig,
        name: DbType.APP,
        database: DbType.APP.toLowerCase(),
        entities: [],
        migrations: [],
      };
    }
    case DbType.IDM: {
      return {
        ...defaultConfig,
        name: DbType.IDM,
        database: DbType.IDM.toLowerCase(),
        entities: [User, UserBasicAuth, RefreshToken],
        migrations: [InitialMigration1727789756173],
      };
    }
  }
};

export const exportConfig = (type: DbType): DataSourceOptions => {
  return {
    ...getDefaultConfig(),
    entities: [join(__dirname, type.toLowerCase(), '/**/*.entity{.ts,.js}')],
    migrations: [join(__dirname, type.toLowerCase(), '/migrations/**/*{.ts,.js}')],
    // cli: {
    //   migrationsDir: 'libs/backend/database/src/lib/migrations',
    // },
  };
};
