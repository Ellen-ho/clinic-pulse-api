import { GenderType } from 'domain/common'
import {
  OnsiteCancelReasonType,
  TreatmentType,
} from 'domain/consultation/Consultation'
import { IDoctorRepository } from 'domain/doctor/interfaces/repositories/IDoctorRepository'
import { SelectedContent } from 'domain/feedback/Feedback'
import { IFeedbackRepository } from 'domain/feedback/interfaces/repositories/IFeedbackRepository'
import { TimePeriodType } from 'domain/timeSlot/TimeSlot'
import { User, UserRoleType } from 'domain/user/User'
import { AuthorizationError } from 'infrastructure/error/AuthorizationError'
import { NotFoundError } from 'infrastructure/error/NotFoundError'

interface GetSingleFeedbackRequest {
  feedbackId: string
  currentUser: User
}

interface GetSingleFeedbackResponse {
  id: string
  receivedDate: string
  receivedAt: Date
  feedbackRating: number
  selectedContent: SelectedContent
  detailedContent: string | null
  consultation: {
    id: string
    consultationDate: string
    consultationTimePeriod: TimePeriodType
    onsiteCancelAt: Date | null
    onsiteCancelReason: OnsiteCancelReasonType | null
    treatmentType: TreatmentType
  }
  doctor: {
    id: string
    firstName: string
    lastName: string
    gender: GenderType
  }
  patient: {
    firstName: string
    lastName: string
    gender: GenderType
  }
}

export class GetSingleFeedbackUseCase {
  constructor(
    private readonly feedbackRepository: IFeedbackRepository,
    private readonly doctorRepository: IDoctorRepository
  ) {}

  public async execute(
    request: GetSingleFeedbackRequest
  ): Promise<GetSingleFeedbackResponse> {
    const { feedbackId, currentUser } = request

    const existingFeedback = await this.feedbackRepository.findById(feedbackId)

    if (existingFeedback == null) {
      throw new NotFoundError('Feedback does not exist.')
    }

    if (currentUser.role === UserRoleType.DOCTOR) {
      const doctor = await this.doctorRepository.findByUserId(currentUser.id)
      if (doctor !== null && doctor.id !== existingFeedback?.doctor.id) {
        console.log(doctor.id)
        throw new AuthorizationError('Doctors can only access their own data.')
      }
    }

    return existingFeedback
  }
}
