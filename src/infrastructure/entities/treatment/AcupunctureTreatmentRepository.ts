import { BaseRepository } from '../../database/BaseRepository'
import { AcupunctureTreatmentEntity } from './AcupunctureTreatmentEntity'
import { AcupunctureTreatment } from '../../../domain/treatment/AcupunctureTreatment'
import { IAcupunctureTreatmentRepository } from '../../../domain/treatment/interfaces/repositories/IAcupunctureTreatmentRepository'
import { DataSource } from 'typeorm'
import { AcupunctureTreatmentMapper } from './AcupunctureTreatmentMapper'
import { RepositoryError } from '../../../infrastructure/error/RepositoryError'

export class AcupunctureTreatmentRepository
  extends BaseRepository<AcupunctureTreatmentEntity, AcupunctureTreatment>
  implements IAcupunctureTreatmentRepository
{
  constructor(dataSource: DataSource) {
    super(
      AcupunctureTreatmentEntity,
      new AcupunctureTreatmentMapper(),
      dataSource
    )
  }

  public async getById(id: string): Promise<AcupunctureTreatment | null> {
    try {
      const entity = await this.getRepo().findOne({
        where: { id },
        relations: ['consultation'],
      })
      return entity != null ? this.getMapper().toDomainModel(entity) : null
    } catch (e) {
      throw new RepositoryError(
        'AcupunctureTreatmentEntity getById error',
        e as Error
      )
    }
  }
}
