import { DataSource } from 'typeorm'
import getOrmConfig from './ormconfig'

export const AppDataSource = new DataSource(getOrmConfig())
