import { ISocketService } from 'domain/network/interfaces/ISocketService'
import {
  Notification,
  NotificationType,
} from '../../domain/notification/Notification'
import { INotificationRepository } from '../../domain/notification/interfaces/repositories/INotificationRepository'
import { User } from '../../domain/user/User'
import { IUuidService } from '../../domain/utils/IUuidService'

interface ICreateNotificationProps {
  title: string
  notificationType: NotificationType
  referenceId: string
  content: string
  user: User
}

export interface INotificationHelper {
  createNotification: (props: ICreateNotificationProps) => Promise<void>
}

export class NotificationHelper implements INotificationHelper {
  constructor(
    private readonly notificationRepository: INotificationRepository,
    private readonly uuidService: IUuidService,
    private readonly socketService: ISocketService
  ) {}

  public async createNotification(
    props: ICreateNotificationProps
  ): Promise<void> {
    const { title, content, notificationType, user, referenceId } = props
    const notification = new Notification({
      id: this.uuidService.generateUuid(),
      isRead: false,
      title,
      content,
      notificationType,
      referenceId,
      createdAt: new Date(),
      updatedAt: new Date(),
      user,
    })
    await this.notificationRepository.save(notification)

    this.socketService.sendToUser(user.id, 'notification', {
      hasUnReadNotification: true,
    })
  }
}
