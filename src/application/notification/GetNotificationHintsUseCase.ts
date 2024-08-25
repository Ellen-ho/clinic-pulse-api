import { INotificationRepository } from '../../domain/notification/interfaces/repositories/INotificationRepository'
import { User } from '../../domain/user/User'
interface GetNotificationHintsRequest {
  user: User
}

interface GetNotificationHintsResponse {
  hasUnReadNotification: boolean
}

export class GetNotificationHintsUseCase {
  constructor(
    private readonly notificationRepository: INotificationRepository
  ) {}

  public async execute(
    request: GetNotificationHintsRequest
  ): Promise<GetNotificationHintsResponse> {
    const { user } = request

    const hasUnReadNotification =
      await this.notificationRepository.findUnreadAndIsNotDeletedByUserId(
        user.id
      )

    return {
      hasUnReadNotification,
    }
  }
}
