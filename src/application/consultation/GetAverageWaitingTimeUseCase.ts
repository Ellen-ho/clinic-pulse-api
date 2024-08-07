import { IConsultationRepository } from 'domain/consultation/interfaces/repositories/IConsultationRepository'
import { TimePeriodType } from 'domain/timeSlot/TimeSlot'

interface GetAverageWaitingTimeRequest {
  startDate: string
  endDate: string
  clinicId?: string
  timePeriod?: TimePeriodType
  doctorId?: string
  patientId?: string
}

interface GetAverageWaitingTimeResponse {
  averageConsultationWait: number
  averageBedAssignmentWait: number
  averageAcupunctureWait: number
  averageNeedleRemovalWait: number
  averageMedicationWait: number
}

export class GetAverageWaitingTimeUseCase {
  constructor(
    private readonly consultationRepository: IConsultationRepository
  ) {}

  public async execute(
    request: GetAverageWaitingTimeRequest
  ): Promise<GetAverageWaitingTimeResponse> {
    const { startDate, endDate, clinicId, timePeriod, doctorId, patientId } =
      request

    const result = await this.consultationRepository.getAverageWaitingTime(
      startDate,
      endDate,
      clinicId,
      timePeriod,
      doctorId,
      patientId
    )

    return result
  }
}
