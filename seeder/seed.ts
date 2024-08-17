import 'reflect-metadata'
import { DataSource, DataSourceOptions } from 'typeorm'
import { runSeeders, SeederOptions } from 'typeorm-extension'
import MainSeeder from './main.seeder'
import TimeSlotSeeder from './timeSlot.seeder'

void (async () => {
  const options: DataSourceOptions & SeederOptions = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT as unknown as number,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB_NAME,
    synchronize: false,
    seeds: [MainSeeder, TimeSlotSeeder],
    entities: ['./src/infrastructure/entities/**/*Entity.ts'],
    migrations: ['./migrations/*.ts'],
    migrationsTableName: 'migrations',
  }

  const dataSource = new DataSource(options)

  await dataSource.initialize().then(async () => {
    try {
      console.log('Data Source has been initialized!')
      await runSeeders(dataSource)
      console.log('Seeder executed successfully!')
      process.exit()
    } catch (error) {
      console.error('Error during Data Source initialization', error)
    }
  })
})()
