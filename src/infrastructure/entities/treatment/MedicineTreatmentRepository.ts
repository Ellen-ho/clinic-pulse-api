import { MedicineTreatment } from 'domain/treatment/MedicineTreatment'
import { DataSource } from 'typeorm'
import { MedicineTreatmentMapper } from './MedicineTreatmentMapper'
import { BaseRepository } from 'infrastructure/database/BaseRepository'
import { IMedicineTreatmentRepository } from 'domain/treatment/interfaces/repositories/IMedicineTreatmentRepository'
import { MedicineTreatmentEntity } from './MedicineTreatmentEntity'

export class MedicineTreatmentRepository
  extends BaseRepository<MedicineTreatmentEntity, MedicineTreatment>
  implements IMedicineTreatmentRepository
{
  constructor(dataSource: DataSource) {
    super(MedicineTreatmentEntity, new MedicineTreatmentMapper(), dataSource)
  }
}
