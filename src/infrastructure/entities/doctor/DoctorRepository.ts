import { BaseRepository } from 'infrastructure/database/BaseRepository'
import { DoctorEntity } from './DoctorEntity'
import { DataSource } from 'typeorm'
import { DoctorMapper } from './DoctorMapper'
import { Doctor } from 'domain/doctor/Doctor'
import { RepositoryError } from 'infrastructure/error/RepositoryError'
import { IDoctorRepository } from 'domain/doctor/interfaces/repositories/IDoctorRepository'

export class DoctorRepository
  extends BaseRepository<DoctorEntity, Doctor>
  implements IDoctorRepository
{
  constructor(dataSource: DataSource) {
    super(DoctorEntity, new DoctorMapper(), dataSource)
  }

  public async findByUserId(userId: string): Promise<Doctor | null> {
    try {
      const entity = await this.getRepo().findOne({
        where: {
          user: {
            id: userId,
          },
        },
        relations: ['user'],
      })
      return entity != null ? this.getMapper().toDomainModel(entity) : null
    } catch (e) {
      throw new RepositoryError(
        'DoctorRepository findByUserId error',
        e as Error
      )
    }
  }

  public async findByAll(): Promise<Array<{ id: string; fullName: string }>> {
    try {
      const result = await this.getQuery<
        Array<{ id: string; full_name: string }>
      >(
        `SELECT
                id,
                CONCAT(last_name, first_name) AS full_name
            FROM
                doctors`
      )
      return result.map((doc) => ({
        id: doc.id,
        fullName: doc.full_name,
      }))
    } catch (e) {
      throw new RepositoryError('DoctorRepository findByAll error', e as Error)
    }
  }
}
