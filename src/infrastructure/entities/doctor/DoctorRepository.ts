import { IDoctorRepository } from 'application/doctor/interfaces/repositories/IDoctorRepository'
import { BaseRepository } from 'infrastructure/database/BaseRepository'
import { DoctorEntity } from './DoctorEntity'
import { DataSource } from 'typeorm'
import { DoctorMapper } from './DoctorMapper'
import { Doctor } from 'domain/doctor/Doctor'
import { RepositoryError } from 'infrastructure/error/RepositoryError'

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
}
