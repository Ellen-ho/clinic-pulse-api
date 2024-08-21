import { Notification } from '../../../domain/notification/Notification'
import { IEntityMapper } from '../../../domain/shared/IEntityMapper'
import { UserMapper } from '../user/UserMapper'
import { NotificationEntity } from './NotificationEntity'

export class NotificationMapper
  implements IEntityMapper<NotificationEntity, Notification>
{
  public toDomainModel(entity: NotificationEntity): Notification {
    const notification = new Notification({
      id: entity.id,
      isRead: entity.isRead,
      title: entity.title,
      content: entity.content,
      notificationType: entity.notificationType,
      referenceId: entity.referenceId === 'null' ? null : entity.referenceId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      user: new UserMapper().toDomainModel(entity.user),
    })
    return notification
  }

  public toPersistence(domainModel: Notification): NotificationEntity {
    const notificationEntity = new NotificationEntity()
    notificationEntity.id = domainModel.id
    notificationEntity.isRead = domainModel.isRead
    notificationEntity.title = domainModel.title
    notificationEntity.content = domainModel.content
    notificationEntity.notificationType = domainModel.notificationType
    notificationEntity.referenceId = domainModel.referenceId
    notificationEntity.createdAt = domainModel.createdAt
    notificationEntity.updatedAt = domainModel.updatedAt
    notificationEntity.user = new UserMapper().toPersistence(domainModel.user)

    return notificationEntity
  }
}
