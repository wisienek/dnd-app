import { DataSource } from 'typeorm';
import { getConfig } from '../lib';
import { DbType } from '@dnd-app/core';

export default new DataSource(getConfig(DbType.IDM));
