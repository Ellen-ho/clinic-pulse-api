import { NotificationHelper } from 'application/notification/NotificationHelper'
import { Feedback, SelectedContent } from 'domain/feedback/Feedback'
import { IFeedbackRepository } from 'domain/feedback/interfaces/repositories/IFeedbackRepository'
import { NotificationType } from 'domain/notification/Notification'
import { IUserRepository } from 'domain/user/interfaces/repositories/IUserRepository'
import { IUuidService } from 'domain/utils/IUuidService'
import { NotFoundError } from 'infrastructure/error/NotFoundError'

interface CreateFeedbackRequest {
  feedbackRating: number
  selectedContent: SelectedContent
  detailedContent: string | null
  consultationId: string
}

interface CreateFeedbackResponse {
  id: string
}

export class CreateFeedbackUseCase {
  constructor(
    private readonly feedbackRepository: IFeedbackRepository,
    private readonly uuidService: IUuidService,
    private readonly notificationHelper: NotificationHelper,
    private readonly userRepository: IUserRepository
  ) {}

  public async execute(
    request: CreateFeedbackRequest
  ): Promise<CreateFeedbackResponse> {
    const { feedbackRating, selectedContent, detailedContent, consultationId } =
      request

    const newFeedback = new Feedback({
      id: this.uuidService.generateUuid(),
      feedbackRating,
      selectedContent,
      detailedContent,
      receivedAt: new Date(),
      consultationId,
    })

    await this.feedbackRepository.save(newFeedback)

    const adminUser = await this.userRepository.findAdmin()

    if (adminUser === null) {
      throw new NotFoundError('Admin user does not exist.')
    }

    await this.notificationHelper.createNotification({
      title: '低於五星的反饋',
      content: 'A new review with a rating below 5 has been posted.',
      notificationType: NotificationType.NEGATIVE_FEEDBACK,
      referenceId: newFeedback.id,
      user: adminUser,
    })

    return {
      id: newFeedback.id,
    }
  }
}
