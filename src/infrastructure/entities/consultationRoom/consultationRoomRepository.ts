import { BaseRepository } from '../../../infrastructure/database/BaseRepository'
import { ConsultationRoomEntity } from './ConsultationRoomEntity'
import { ConsultationRoom } from '../../../domain/consultationRoom/ConsultationRoom'
import { DataSource } from 'typeorm'
import { ConsultationRoomMapper } from './ConsultationRoomMapper'
import { IConsultationRoomRepository } from '../../../domain/consultationRoom/interfaces/repositories/IConsultationRoomRepository'

export class ConsultationRoomRepository
  extends BaseRepository<ConsultationRoomEntity, ConsultationRoom>
  implements IConsultationRoomRepository
{
  constructor(dataSource: DataSource) {
    super(ConsultationRoomEntity, new ConsultationRoomMapper(), dataSource)
  }

  public async save(consultationRoom: ConsultationRoom): Promise<void> {
    try {
      await super.save(consultationRoom)
    } catch (e) {
      throw new Error(
        'ConsultationRoomRepository save error: ' + (e as Error).message
      )
    }
  }
}
