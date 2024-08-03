import { IConsultationRepository } from 'domain/consultation/interfaces/repositories/IConsultationRepository'
import { NotFoundError } from 'infrastructure/error/NotFoundError'

interface GetConsultationOnlineBookingRateRequest {
  startDate: string
  endDate: string
  clinicId: string
}

interface GetConsultationOnlineBookingRateResponse {
  totalConsultation: number
  consultationWithOnlineBooking: number
  onlineBookingRate: number
}

export class GetConsultationOnlineBookingRateUseCase {
  constructor(
    private readonly consultationRepository: IConsultationRepository
  ) {}

  public async execute(
    request: GetConsultationOnlineBookingRateRequest
  ): Promise<GetConsultationOnlineBookingRateResponse> {
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

    const onlineBookingRate =
      (result.consultationWithOnlineBooking / result.totalConsultation) * 100

    return {
      totalConsultation: result.totalConsultation,
      consultationWithOnlineBooking: result.consultationWithOnlineBooking,
      onlineBookingRate,
    }
  }
}
