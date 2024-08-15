import { BaseRepository } from '../../database/BaseRepository'
import { AcupunctureTreatmentEntity } from './AcupunctureTreatmentEntity'
import { AcupunctureTreatment } from '../../../domain/treatment/AcupunctureTreatment'
import { IAcupunctureTreatmentRepository } from '../../../domain/treatment/interfaces/repositories/IAcupunctureTreatmentRepository'
import { DataSource } from 'typeorm'
import { AcupunctureTreatmentMapper } from './AcupunctureTreatmentMapper'

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
}
