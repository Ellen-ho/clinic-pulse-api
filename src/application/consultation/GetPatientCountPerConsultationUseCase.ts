import { IConsultationRepository } from 'domain/consultation/interfaces/repositories/IConsultationRepository'
import { TimePeriodType } from 'domain/timeSlot/TimeSlot'
import { NotFoundError } from 'infrastructure/error/NotFoundError'

interface GetPatientCountPerConsultationRequest {
  startDate: string
  endDate: string
  clinicId?: string
  doctorId?: string
  timePeriod?: TimePeriodType
}

interface GetPatientCountPerConsultationResponse {
  totalConsultations: number
  totalSlots: number
  averagePatientPerSlot: number
  data: Array<{
    date: string
    consultationCount: number
  }>
}

export class GetPatientCountPerConsultationUseCase {
  constructor(
    private readonly consultationRepository: IConsultationRepository
  ) {}

  public async execute(
    request: GetPatientCountPerConsultationRequest
  ): Promise<GetPatientCountPerConsultationResponse> {
    const { startDate, endDate, clinicId, doctorId, timePeriod } = request

    const result = await this.consultationRepository.getAveragePatientCount(
      startDate,
      endDate,
      clinicId,
      doctorId,
      timePeriod
    )

    let totalSlots = 0
    const start = new Date(startDate)
    const end = new Date(endDate)

    while (start.getTime() <= end.getTime()) {
      const dayOfWeek = start.getUTCDay()
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        totalSlots += 3
      }
      start.setDate(start.getDate() + 1)
    }

    if (totalSlots === 0) {
      throw new NotFoundError(' No slot exists.')
    }

    const averagePatientPerSlot = Math.round(
      result.totalConsultations / totalSlots
    )

    return {
      totalConsultations: result.totalConsultations,
      totalSlots,
      averagePatientPerSlot,
      data: result.data,
    }
  }
}
