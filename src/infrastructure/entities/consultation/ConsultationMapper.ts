import { IEntityMapper } from 'domain/shared/IEntityMapper'
import { ConsultationEntity } from './ConsultationEntity'
import { Consultation } from 'domain/consultation/Consultation'
import { AcupunctureTreatmentMapper } from '../treatment/AcupunctureTreatmentMapper'
import { MedicineTreatmentMapper } from '../treatment/MedicineTreatmentMapper'

export class ConsultationMapper
  implements IEntityMapper<ConsultationEntity, Consultation>
{
  public toDomainModel(entity: ConsultationEntity): Consultation {
    const consultation = new Consultation({
      id: entity.id,
      status: entity.status,
      source: entity.source,
      consultationNumber: entity.consultationNumber,
      checkInAt: entity.checkInAt,
      startAt: entity.startAt,
      endAt: entity.endAt,
      checkOutAt: entity.checkOutAt,
      onsiteCancelAt: entity.onsiteCancelAt,
      onsiteCancelReason: entity.onsiteCancelReason,
      isFirstTimeVisit: entity.isFirstTimeVisit,
      acupunctureTreatment:
        entity.acupunctureTreatment !== null
          ? new AcupunctureTreatmentMapper().toDomainModel(
              entity.acupunctureTreatment
            )
          : null,
      medicineTreatment:
        entity.medicineTreatment !== null
          ? new MedicineTreatmentMapper().toDomainModel(
              entity.medicineTreatment
            )
          : null,
      patientId: entity.patientId,
      timeSlotId: entity.timeSlotId,
    })
    return consultation
  }

  public toPersistence(domainModel: Consultation): ConsultationEntity {
    const consultationEntity = new ConsultationEntity()
    consultationEntity.id = domainModel.id
    consultationEntity.status = domainModel.status
    consultationEntity.source = domainModel.source
    consultationEntity.consultationNumber = domainModel.consultationNumber
    consultationEntity.checkInAt = domainModel.checkInAt
    consultationEntity.startAt = domainModel.startAt
    consultationEntity.endAt = domainModel.endAt
    consultationEntity.onsiteCancelAt = domainModel.onsiteCancelAt
    consultationEntity.onsiteCancelReason = domainModel.onsiteCancelReason
    consultationEntity.isFirstTimeVisit = domainModel.isFirstTimeVisit
    consultationEntity.acupunctureTreatment =
      domainModel.acupunctureTreatment !== null
        ? new AcupunctureTreatmentMapper().toPersistence(
            domainModel.acupunctureTreatment
          )
        : null
    consultationEntity.medicineTreatment =
      domainModel.medicineTreatment !== null
        ? new MedicineTreatmentMapper().toPersistence(
            domainModel.medicineTreatment
          )
        : null
    consultationEntity.patientId = domainModel.patientId
    consultationEntity.timeSlotId = domainModel.timeSlotId

    return consultationEntity
  }
}
