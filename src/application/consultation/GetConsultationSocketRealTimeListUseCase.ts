import { GenderType } from '../../domain/common'
import { ConsultationStatus } from '../../domain/consultation/Consultation'
import { IConsultationRepository } from '../../domain/consultation/interfaces/repositories/IConsultationRepository'
import { RoomNumberType } from '../../domain/consultationRoom/ConsultationRoom'

export interface GetConsultationSocketRealTimeListRequest {
  consultationId: string
}

interface GetConsultationSocketRealTimeListResponse {
  id: string
  isOnsiteCanceled: boolean
  consultationNumber: number
  doctor: {
    firstName: string
    lastName: string
  }
  patient: {
    firstName: string
    lastName: string
    gender: GenderType
    age: number
  }
  status: ConsultationStatus
  timeSlotId: string
  clinicId: string
  consultationRoomNumber: RoomNumberType
}

export class GetConsultationSocketRealTimeListUseCase {
  constructor(
    private readonly consultationRepository: IConsultationRepository
  ) {}

  public async execute(
    request: GetConsultationSocketRealTimeListRequest
  ): Promise<GetConsultationSocketRealTimeListResponse | null> {
    const { consultationId } = request

    const socketData = await this.consultationRepository.getSocketUpdatedData(
      consultationId
    )

    return {
      ...socketData,
    }
  }
}
