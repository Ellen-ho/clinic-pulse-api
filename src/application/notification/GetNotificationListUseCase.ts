import { NotificationType } from '../../domain/notification/Notification'
import { INotificationRepository } from '../../domain/notification/interfaces/repositories/INotificationRepository'
import { User } from '../../domain/user/User'
import { getOffset, getPagination } from '../../infrastructure/utils/Pagination'

interface GetNotificationListRequest {
  user: User
  page?: number
  limit?: number
}

interface GetNotificationListResponse {
  data: Array<{
    id: string
    title: string
    isRead: boolean
    content: string
    notificationType: NotificationType
    createdAt: Date
    updatedAt: Date
  }> | null
  pagination: {
    pages: number[]
    totalPage: number
    currentPage: number
    prev: number
    next: number
  }
}

export class GetNotificationListUseCase {
  constructor(
    private readonly notificationRepository: INotificationRepository
  ) {}

  public async execute(
    request: GetNotificationListRequest
  ): Promise<GetNotificationListResponse> {
    const { user } = request
    const page: number = request.page != null ? request.page : 1
    const limit: number = request.limit != null ? request.limit : 10
    const offset: number = getOffset(limit, page)

    const existingNotificationList =
      await this.notificationRepository.findByUserIdAndIsNotDeletedAndCountAll(
        user.id,
        limit,
        offset
      )

    return {
      data: existingNotificationList.notifications,
      pagination: getPagination(
        limit,
        page,
        existingNotificationList.total_counts
      ),
    }
  }
}
