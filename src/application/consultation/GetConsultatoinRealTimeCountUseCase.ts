import { IConsultationRepository } from 'domain/consultation/interfaces/repositories/IConsultationRepository'

interface GetConsultationRealTimeCountRequest {
  clinicId?: string
  consultationRoomNumber?: string
}

interface GetConsultationRealTimeCountResponse {
  waitForConsultationCount: number
  waitForBedAssignedCount: number
  waitForAcupunctureTreatmentCount: number
  waitForNeedleRemovedCount: number
  waitForMedicineCount: number
  completedCount: number
}

export class GetConsultationRealTimeCountUseCase {
  constructor(
    private readonly consultationRepository: IConsultationRepository
  ) {}

  public async execute(
    request: GetConsultationRealTimeCountRequest
  ): Promise<GetConsultationRealTimeCountResponse> {
    const { clinicId, consultationRoomNumber } = request

    const result = await this.consultationRepository.getRealTimeCounts(
      clinicId,
      consultationRoomNumber
    )

    return {
      waitForConsultationCount: result.waitForConsultationCount,
      waitForBedAssignedCount: result.waitForBedAssignedCount,
      waitForAcupunctureTreatmentCount: result.waitForAcupunctureTreatmentCount,
      waitForNeedleRemovedCount: result.waitForNeedleRemovedCount,
      waitForMedicineCount: result.waitForMedicineCount,
      completedCount: result.completedCount,
    }
  }
}
