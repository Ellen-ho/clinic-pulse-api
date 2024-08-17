import { Clinic } from '../../../domain/clinic/Clinic'
import { BaseRepository } from '../../../infrastructure/database/BaseRepository'
import { ClinicEntity } from './ClinicEntity'
import { DataSource } from 'typeorm'
import { ClinicMapper } from './ClinicMapper'
import { RepositoryError } from '../../../infrastructure/error/RepositoryError'
import { IClinicRepository } from '../../../domain/clinic/interfaces/repositories/IClinicRepository'

export class ClinicRepository
  extends BaseRepository<ClinicEntity, Clinic>
  implements IClinicRepository
{
  constructor(dataSource: DataSource) {
    super(ClinicEntity, new ClinicMapper(), dataSource)
  }

  public async findByAll(): Promise<Array<{ id: string; name: string }>> {
    try {
      const result = await this.getQuery<Array<{ id: string; name: string }>>(
        `SELECT
            id,
            name
        FROM
            clinics`
      )
      return result.map((doc) => ({
        id: doc.id,
        name: doc.name,
      }))
    } catch (e) {
      throw new RepositoryError('ClinicRepository findByAll error', e as Error)
    }
  }
}
