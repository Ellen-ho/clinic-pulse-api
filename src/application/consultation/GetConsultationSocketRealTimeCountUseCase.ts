import { IConsultationRepository } from '../../domain/consultation/interfaces/repositories/IConsultationRepository'
export interface GetConsultationSocketRealTimeCountRequest {
  consultationId: string
}

interface GetConsultationSocketRealTimeCountResponse {
  timeSlotId: string
  clinicId: string
  consultationRoomNumber: string
  waitForConsultationCount: number
  waitForBedAssignedCount: number
  waitForAcupunctureTreatmentCount: number
  waitForNeedleRemovedCount: number
  waitForMedicineCount: number
  completedCount: number
}

export class GetConsultationSocketRealTimeCountUseCase {
  constructor(
    private readonly consultationRepository: IConsultationRepository
  ) {}

  public async execute(
    request: GetConsultationSocketRealTimeCountRequest
  ): Promise<GetConsultationSocketRealTimeCountResponse | null> {
    const { consultationId } = request

    const socketData = await this.consultationRepository.findSocketData(
      consultationId
    )

    const realTimeCounts = await this.consultationRepository.getRealTimeCounts(
      socketData.timeSlotId
    )

    return {
      ...socketData,
      ...realTimeCounts,
    }
  }
}
