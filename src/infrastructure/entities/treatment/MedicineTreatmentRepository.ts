import { MedicineTreatment } from '../../../domain/treatment/MedicineTreatment'
import { DataSource } from 'typeorm'
import { MedicineTreatmentMapper } from './MedicineTreatmentMapper'
import { BaseRepository } from '../../../infrastructure/database/BaseRepository'
import { IMedicineTreatmentRepository } from '../../../domain/treatment/interfaces/repositories/IMedicineTreatmentRepository'
import { MedicineTreatmentEntity } from './MedicineTreatmentEntity'
import { RepositoryError } from '../../../infrastructure/error/RepositoryError'

export class MedicineTreatmentRepository
  extends BaseRepository<MedicineTreatmentEntity, MedicineTreatment>
  implements IMedicineTreatmentRepository
{
  constructor(dataSource: DataSource) {
    super(MedicineTreatmentEntity, new MedicineTreatmentMapper(), dataSource)
  }

  public async getById(id: string): Promise<MedicineTreatment | null> {
    try {
      const entity = await this.getRepo().findOne({
        where: { id },
        relations: ['consultation'],
      })
      return entity != null ? this.getMapper().toDomainModel(entity) : null
    } catch (e) {
      throw new RepositoryError(
        'MedicineTreattEntity getById error',
        e as Error
      )
    }
  }

  public async findByConsultationId(
    consultationId: string
  ): Promise<MedicineTreatment | null> {
    try {
      const rawQuery = `
      SELECT at.*
      FROM medicine_treatments at
      INNER JOIN consultations c ON c.medicine_treatment_id = at.id
      WHERE c.id = $1
    `

      const result = await this.getQuery<MedicineTreatmentEntity[]>(rawQuery, [
        consultationId,
      ])

      if (result.length === 0) {
        return null
      }

      return this.getMapper().toDomainModel(result[0])
    } catch (e) {
      throw new RepositoryError(
        'MedicineTreatmentEntity findByConsultationId error',
        e as Error
      )
    }
  }
}
