import { INotificationRepository } from '../../domain/notification/interfaces/repositories/INotificationRepository'
import { User } from '../../domain/user/User'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'

interface DeleteAllNotificationsRequest {
  user: User
}

interface DeleteAllNotificationsResponse {
  deletedAt: Date
}

export class DeleteAllNotificationsUseCase {
  constructor(
    private readonly notificationRepository: INotificationRepository
  ) {}

  public async execute(
    request: DeleteAllNotificationsRequest
  ): Promise<DeleteAllNotificationsResponse> {
    const { user } = request

    const existingNotifications =
      await this.notificationRepository.findAllByUserId(user.id)

    if (existingNotifications == null) {
      throw new NotFoundError('No notification exits.')
    }

    await this.notificationRepository.deleteAllByUserId(user.id)

    return { deletedAt: new Date() }
  }
}
