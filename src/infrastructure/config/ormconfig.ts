import { DataSourceOptions } from 'typeorm'
import 'dotenv/config'

const isProd = process.env.NODE_ENV === 'production'
const entities = isProd
  ? ['./build/infrastructure/entities/**/*Entity.js']
  : ['./src/infrastructure/entities/**/*Entity.ts']

const migrations = isProd ? [] : ['./migrations/*.ts']

const OrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT as unknown as number,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB_NAME,
  synchronize: false,
  logging: true,
  entities,
  migrations,
  migrationsTableName: 'migrations',
  // ssl: true,
}

export default function getOrmConfig(): DataSourceOptions {
  return OrmConfig
}
