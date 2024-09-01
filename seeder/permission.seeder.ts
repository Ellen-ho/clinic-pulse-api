import { DataSource } from 'typeorm'
import { Seeder, SeederFactoryManager } from 'typeorm-extension'
import { PermissionEntity } from '../src/infrastructure/entities/permission/PermissionEntity'
import dotenv from 'dotenv'
import { PERMISSIONS } from './constant/permission'

dotenv.config()

export default class PermissionSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<any> {
    const permissionRepository = dataSource.getRepository(PermissionEntity)

    for (const permission of PERMISSIONS) {
      try {
        await permissionRepository.save(permission)
        console.log(`Inserted permissions successfully!`)
      } catch (error) {
        console.error('Error inserting permission:', error)
      }
    }
  }
}
