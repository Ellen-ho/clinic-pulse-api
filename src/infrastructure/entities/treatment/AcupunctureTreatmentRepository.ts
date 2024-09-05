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

  public async findByConsultationId(
    consultationId: string
  ): Promise<AcupunctureTreatment | null> {
    try {
      const rawQuery = `
      SELECT at.*
      FROM acupuncture_treatments at
      INNER JOIN consultations c ON c.acupuncture_treatment_id = at.id
      WHERE c.id = $1
    `

      const result = await this.getQuery<AcupunctureTreatmentEntity[]>(
        rawQuery,
        [consultationId]
      )

      if (result.length === 0) {
        return null
      }

      return this.getMapper().toDomainModel(result[0])
    } catch (e) {
      throw new RepositoryError(
        'AcupunctureTreatmentEntity findByConsultationId error',
        e as Error
      )
    }
  }
}
