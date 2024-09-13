import { DataSource } from 'typeorm';
import { getConfig } from '../lib';
import { DbType } from '../../../../core/src/lib';

export default new DataSource(getConfig(DbType.IDM));
