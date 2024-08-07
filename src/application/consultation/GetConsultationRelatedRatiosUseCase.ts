import { IConsultationRepository } from 'domain/consultation/interfaces/repositories/IConsultationRepository'
import { NotFoundError } from 'infrastructure/error/NotFoundError'

interface GetConsultationRelatedRatiosRequest {
  startDate: string
  endDate: string
  clinicId?: string
}

interface GetConsultationRelatedRatiosResponse {
  totalConsultations: number
  consultationWithOnlineBooking: number
  consultationWithOnsiteCancel: number
  onlineBookingRate: number
  onsiteCancelRate: number
}

export class GetConsultationRelatedRatiosUseCase {
  constructor(
    private readonly consultationRepository: IConsultationRepository
  ) {}

  public async execute(
    request: GetConsultationRelatedRatiosRequest
  ): Promise<GetConsultationRelatedRatiosResponse> {
    const { startDate, endDate, clinicId } = request

    const result = await this.consultationRepository.findByDateRangeAndClinic(
      startDate,
      endDate,
      clinicId
    )

    if (result.totalConsultation === 0) {
      throw new NotFoundError(
        'No consultation data matches the specified criteria.'
      )
    }

    const onlineBookingRate = Math.round(
      (result.consultationWithOnlineBooking / result.totalConsultation) * 100
    )

    const onsiteCancelRate = Math.round(
      (result.consultationWithOnsiteCancel / result.totalConsultation) * 100
    )

    return {
      totalConsultations: result.totalConsultation,
      consultationWithOnlineBooking: result.consultationWithOnlineBooking,
      consultationWithOnsiteCancel: result.consultationWithOnsiteCancel,
      onlineBookingRate,
      onsiteCancelRate,
    }
  }
}
