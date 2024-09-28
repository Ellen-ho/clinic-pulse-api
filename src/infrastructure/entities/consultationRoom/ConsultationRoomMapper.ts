import { IEntityMapper } from '../../../domain/shared/IEntityMapper'
import { ConsultationRoomEntity } from './ConsultationRoomEntity'
import { ConsultationRoom } from '../../../domain/consultationRoom/ConsultationRoom'

export class ConsultationRoomMapper
  implements IEntityMapper<ConsultationRoomEntity, ConsultationRoom>
{
  public toDomainModel(entity: ConsultationRoomEntity): ConsultationRoom {
    const consultationRoom = new ConsultationRoom({
      id: entity.id,
      clinicId: entity.clinicId,
      roomNumber: entity.roomNumber,
    })
    return consultationRoom
  }

  public toPersistence(domainModel: ConsultationRoom): ConsultationRoomEntity {
    const consultationRoomEntity = new ConsultationRoomEntity()
    consultationRoomEntity.id = domainModel.id
    consultationRoomEntity.clinicId = domainModel.clinicId
    consultationRoomEntity.roomNumber = domainModel.roomNumber

    return consultationRoomEntity
  }
}
