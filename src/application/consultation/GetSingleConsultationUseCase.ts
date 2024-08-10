import { GenderType } from 'domain/clinic/Clinic'
import {
  OnsiteCancelReasonType,
  TreatmentType,
} from 'domain/consultation/Consultation'

import { IConsultationRepository } from 'domain/consultation/interfaces/repositories/IConsultationRepository'
import { TimePeriodType } from 'domain/timeSlot/TimeSlot'
import { NotFoundError } from 'infrastructure/error/NotFoundError'

interface GetSingleConsultationRequest {
  consultationId: string
}

interface GetSingleConsultationResponse {
  id: string
  consultationDate: string
  consultationTimePeriod: TimePeriodType
  consultationNumber: number
  onsiteCancelAt: Date | null
  onsiteCancelReason: OnsiteCancelReasonType | null
  checkInAt: Date
  startAt: Date | null
  endAt: Date | null
  checkOutAt: Date | null
  treatmentType: TreatmentType
  patient: {
    firstName: string
    lastName: string
    gender: GenderType
    age: number
  }
  doctor: {
    firstName: string
    lastName: string
    gender: GenderType
  }
  acupunctureTreatment: {
    id: string | null
    startAt: Date | null
    endAt: Date | null
    assignBedAt: Date | null
    removeNeedleAt: Date | null
  } | null
  medicineTreatment: {
    id: string | null
    getMedicineAt: Date | null
  } | null
}

export class GetSingleConsultationUseCase {
  constructor(
    private readonly consultationRepository: IConsultationRepository
  ) {}

  public async execute(
    request: GetSingleConsultationRequest
  ): Promise<GetSingleConsultationResponse> {
    const { consultationId } = request

    const existingConsultation = await this.consultationRepository.findById(
      consultationId
    )

    if (existingConsultation == null) {
      throw new NotFoundError('Consultation does not exist.')
    }

    return existingConsultation
  }
}
