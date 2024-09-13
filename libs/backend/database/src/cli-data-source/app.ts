import { DataSource } from 'typeorm';
import { getConfig } from '@dnd-app/db';
import { DbType } from '@dnd-app/core';

export default new DataSource(getConfig(DbType.APP));
