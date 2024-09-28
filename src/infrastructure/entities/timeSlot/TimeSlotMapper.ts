import { TimeSlot } from '../../../domain/timeSlot/TimeSlot'
import { IEntityMapper } from '../../../domain/shared/IEntityMapper'
import { TimeSlotEntity } from './TimeSlotEntity'

export class TimeSlotMapper implements IEntityMapper<TimeSlotEntity, TimeSlot> {
  public toDomainModel(entity: TimeSlotEntity): TimeSlot {
    const timeSlot = new TimeSlot({
      id: entity.id,
      startAt: entity.startAt,
      endAt: entity.endAt,
      timePeriod: entity.timePeriod,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      doctorId: entity.doctorId,
      clinicId: entity.clinicId,
      consultationRoomId: entity.consultationRoomId,
    })
    return timeSlot
  }

  public toPersistence(domainModel: TimeSlot): TimeSlotEntity {
    const timeSlotEntity = new TimeSlotEntity()
    timeSlotEntity.id = domainModel.id
    timeSlotEntity.startAt = domainModel.startAt
    timeSlotEntity.endAt = domainModel.endAt
    timeSlotEntity.timePeriod = domainModel.timePeriod
    timeSlotEntity.createdAt = domainModel.createdAt
    timeSlotEntity.updatedAt = domainModel.updatedAt
    timeSlotEntity.doctorId = domainModel.doctorId
    timeSlotEntity.clinicId = domainModel.clinicId
    timeSlotEntity.consultationRoomId = domainModel.consultationRoomId

    return timeSlotEntity
  }
}
