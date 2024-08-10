import { GenderType } from 'domain/common'
import {
  OnsiteCancelReasonType,
  TreatmentType,
} from 'domain/consultation/Consultation'
import { SelectedContent } from 'domain/feedback/Feedback'
import { IFeedbackRepository } from 'domain/feedback/interfaces/repositories/IFeedbackRepository'
import { TimePeriodType } from 'domain/timeSlot/TimeSlot'
import { NotFoundError } from 'infrastructure/error/NotFoundError'

interface GetSingleFeedbackRequest {
  feedbackId: string
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
  constructor(private readonly feedbackRepository: IFeedbackRepository) {}

  public async execute(
    request: GetSingleFeedbackRequest
  ): Promise<GetSingleFeedbackResponse> {
    const { feedbackId } = request

    const existingFeedback = await this.feedbackRepository.findById(feedbackId)

    if (existingFeedback == null) {
      throw new NotFoundError('Feedback does not exist.')
    }

    return existingFeedback
  }
}
