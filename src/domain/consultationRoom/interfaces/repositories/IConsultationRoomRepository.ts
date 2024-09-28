import { ConsultationRoom } from 'domain/consultationRoom/ConsultationRoom'
import { IBaseRepository } from '../../../../domain/shared/IBaseRepository'

export interface IConsultationRoomRepository
  extends IBaseRepository<ConsultationRoom> {
  save: (consultationRoom: ConsultationRoom) => Promise<void>
}
