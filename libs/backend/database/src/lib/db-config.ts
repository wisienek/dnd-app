import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { DataSourceOptions } from 'typeorm';
import { join } from 'path';
import { DatabaseConfig, getStaticConfig } from '@dnd-app/config';
import { DbType } from '@dnd-app/core';
import { RefreshToken, User, UserBasicAuth } from './entities/idm';

const getDefaultConfig = (): PostgresConnectionOptions => {
  const config = getStaticConfig(DatabaseConfig);

  return {
    type: 'postgres',
    host: config.host,
    port: config.port,
    username: config.user,
    password: config.password,
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
        name: DbType.APP.toLowerCase(),
        database: DbType.APP.toLowerCase(),
        entities: [],
        migrations: [],
      };
    }
    case DbType.IDM: {
      return {
        ...defaultConfig,
        name: DbType.IDM.toLowerCase(),
        database: DbType.IDM.toLowerCase(),
        entities: [User, UserBasicAuth, RefreshToken],
        migrations: [],
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
