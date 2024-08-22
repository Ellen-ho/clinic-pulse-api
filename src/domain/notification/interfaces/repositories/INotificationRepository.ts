import { IBaseRepository } from '../../../shared/IBaseRepository'
import { IExecutor } from '../../../shared/IRepositoryTx'
import { Notification, NotificationType } from '../../Notification'

export interface INotificationRepository extends IBaseRepository<Notification> {
  findByIdAndUserId: (
    notificationId: string,
    userId: string
  ) => Promise<Notification | null>
  findByUserIdAndIsNotDeletedAndCountAll: (
    userId: string,
    limit: number,
    offset: number
  ) => Promise<{
    total_counts: number
    notifications: Array<{
      id: string
      title: string
      content: string
      isRead: boolean
      notificationType: NotificationType
      referenceId: string
      createdAt: Date
      updatedAt: Date
    }>
  }>
  findUnreadAndIsNotDeletedByUserId: (userId: string) => Promise<boolean>
  findAllUnreadNotificationsByUserId: (
    userId: string
  ) => Promise<Notification[]>
  saveAll: (notifications: Notification[]) => Promise<void>
  findAllByUserId: (userId: string) => Promise<Notification[]>
  deleteAllByUserId: (userId: string) => Promise<void>
  delete: (notification: Notification, executo?: IExecutor) => Promise<void>
}
