import { MedicineTreatment } from 'domain/treatment/MedicineTreatment'
import { MedicineTreatmentEntity } from './MedicineTreatmentEntity'
import { IEntityMapper } from 'domain/shared/IEntityMapper'

export class MedicineTreatmentMapper
  implements IEntityMapper<MedicineTreatmentEntity, MedicineTreatment>
{
  public toDomainModel(entity: MedicineTreatmentEntity): MedicineTreatment {
    const medicineTreatment = new MedicineTreatment({
      id: entity.id,
      getMedicineAt: entity.getMedicineAt,
    })
    return medicineTreatment
  }

  public toPersistence(
    domainModel: MedicineTreatment
  ): MedicineTreatmentEntity {
    const medicineTreatmentEntity = new MedicineTreatmentEntity()
    medicineTreatmentEntity.id = domainModel.id
    medicineTreatmentEntity.getMedicineAt = domainModel.getMedicineAt

    return medicineTreatmentEntity
  }
}
