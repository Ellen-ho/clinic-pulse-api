import { NotificationType } from '../../domain/notification/Notification'
import { INotificationRepository } from '../../domain/notification/interfaces/repositories/INotificationRepository'
import { User } from '../../domain/user/User'
import { getOffset, getPagination } from '../../infrastructure/utils/Pagination'

interface GetNotificationListRequest {
  user: User
  page?: string
  limit?: string
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
    const { user, page, limit } = request
    const requestPage: number = page !== undefined ? Number(page) : 1
    const requestLimit: number = limit !== undefined ? Number(limit) : 10
    const offset: number = getOffset(requestLimit, requestPage)

    const existingNotificationList =
      await this.notificationRepository.findByUserIdAndIsNotDeletedAndCountAll(
        user.id,
        requestLimit,
        offset
      )

    return {
      data: existingNotificationList.notifications,
      pagination: getPagination(
        requestLimit,
        offset,
        existingNotificationList.total_counts
      ),
    }
  }
}
