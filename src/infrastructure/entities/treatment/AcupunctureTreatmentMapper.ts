import { IEntityMapper } from 'domain/shared/IEntityMapper'
import { AcupunctureTreatment } from 'domain/treatment/AcupunctureTreatment'
import { AcupunctureTreatmentEntity } from './AcupunctureTreatmentEntity'

export class AcupunctureTreatmentMapper
  implements IEntityMapper<AcupunctureTreatmentEntity, AcupunctureTreatment>
{
  public toDomainModel(
    entity: AcupunctureTreatmentEntity
  ): AcupunctureTreatment {
    const acupunctureTreatment = new AcupunctureTreatment({
      id: entity.id,
      startAt: entity.startAt,
      endAt: entity.endAt,
      bedId: entity.bedId,
      assignBedAt: entity.assignBedAt,
      removeNeedleAt: entity.removeNeedleAt,
      needleCounts: entity.needleCounts,
    })
    return acupunctureTreatment
  }

  public toPersistence(
    domainModel: AcupunctureTreatment
  ): AcupunctureTreatmentEntity {
    const acupunctureTreatmentEntity = new AcupunctureTreatmentEntity()
    acupunctureTreatmentEntity.id = domainModel.id
    acupunctureTreatmentEntity.startAt = domainModel.startAt
    acupunctureTreatmentEntity.endAt = domainModel.endAt
    acupunctureTreatmentEntity.bedId = domainModel.bedId
    acupunctureTreatmentEntity.assignBedAt = domainModel.assignBedAt
    acupunctureTreatmentEntity.removeNeedleAt = domainModel.removeNeedleAt
    acupunctureTreatmentEntity.needleCounts = domainModel.needleCounts

    return acupunctureTreatmentEntity
  }
}
