import { SelectedContent } from 'domain/feedback/Feedback'
import { IFeedbackRepository } from 'domain/feedback/interfaces/repositories/IFeedbackRepository'
import { NotFoundError } from 'infrastructure/error/NotFoundError'

interface GetSingleFeedbackRequest {
  feedbackId: string
}

interface GetSingleFeedbackResponse {
  feedbackRating: number
  selectedContent: SelectedContent
  detailedContent: string | null
  consultationId: string
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
