import { GenderType } from 'domain/clinic/Clinic'
import {
  OnsiteCancelReasonType,
  TreatmentType,
} from 'domain/consultation/Consultation'

import { IConsultationRepository } from 'domain/consultation/interfaces/repositories/IConsultationRepository'
import { IDoctorRepository } from 'domain/doctor/interfaces/repositories/IDoctorRepository'
import { TimePeriodType } from 'domain/timeSlot/TimeSlot'
import { User, UserRoleType } from 'domain/user/User'
import { AuthorizationError } from 'infrastructure/error/AuthorizationError'
import { NotFoundError } from 'infrastructure/error/NotFoundError'

interface GetSingleConsultationRequest {
  consultationId: string
  currentUser: User
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
    id: string
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
    private readonly consultationRepository: IConsultationRepository,
    private readonly doctorRepository: IDoctorRepository
  ) {}

  public async execute(
    request: GetSingleConsultationRequest
  ): Promise<GetSingleConsultationResponse> {
    const { consultationId, currentUser } = request

    const existingConsultation = await this.consultationRepository.findById(
      consultationId
    )

    if (currentUser.role === UserRoleType.DOCTOR) {
      const doctor = await this.doctorRepository.findByUserId(currentUser.id)
      if (doctor !== null && doctor.id !== existingConsultation?.doctor.id) {
        throw new AuthorizationError('Doctors can only access their own data.')
      }
    }

    if (existingConsultation == null) {
      throw new NotFoundError('Consultation does not exist.')
    }

    return existingConsultation
  }
}
