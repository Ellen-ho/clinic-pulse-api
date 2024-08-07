import { IConsultationRepository } from 'domain/consultation/interfaces/repositories/IConsultationRepository'
import { TimePeriodType } from 'domain/timeSlot/TimeSlot'
import { NotFoundError } from 'infrastructure/error/NotFoundError'

interface GetFirstTimeConsultationCountAndRateRequest {
  startDate: string
  endDate: string
  clinicId?: string
  timePeriod?: TimePeriodType
  doctorId?: string
}

interface GetFirstTimeConsultationCountAndRateResponse {
  firstTimeConsultationCount: number
  firstTimeConsultationRate: number
}

export class GetFirstTimeConsultationCountAndRateUseCase {
  constructor(
    private readonly consultationRepository: IConsultationRepository
  ) {}

  public async execute(
    request: GetFirstTimeConsultationCountAndRateRequest
  ): Promise<GetFirstTimeConsultationCountAndRateResponse> {
    const { startDate, endDate, clinicId, timePeriod, doctorId } = request

    const result =
      await this.consultationRepository.getFirstTimeConsultationCounts(
        startDate,
        endDate,
        clinicId,
        timePeriod,
        doctorId
      )

    if (result.totalConsultationCount === 0) {
      throw new NotFoundError(
        'No consultation data matches the specified criteria.'
      )
    }

    const firstTimeConsultationRate =
      (result.firstTimeConsultationCount / result.totalConsultationCount) * 100

    return {
      firstTimeConsultationCount: result.firstTimeConsultationCount,
      firstTimeConsultationRate,
    }
  }
}
