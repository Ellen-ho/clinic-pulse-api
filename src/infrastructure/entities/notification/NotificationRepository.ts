import { DataSource } from 'typeorm'
import {
  Notification,
  NotificationType,
} from '../../../domain/notification/Notification'
import { INotificationRepository } from '../../../domain/notification/interfaces/repositories/INotificationRepository'
import { BaseRepository } from '../../database/BaseRepository'
import { NotificationEntity } from './NotificationEntity'
import { NotificationMapper } from './NotificationMapper'
import { RepositoryError } from '../../error/RepositoryError'
import { IExecutor } from '../../../domain/shared/IRepositoryTx'

export class NotificationRepository
  extends BaseRepository<NotificationEntity, Notification>
  implements INotificationRepository
{
  constructor(dataSource: DataSource) {
    super(NotificationEntity, new NotificationMapper(), dataSource)
  }

  public async findByIdAndUserId(
    notificationId: string,
    userId: string
  ): Promise<Notification | null> {
    try {
      const entity = await this.getRepo().findOne({
        where: {
          id: notificationId,
          user: { id: userId },
        },
        relations: ['user'],
      })
      return entity != null ? this.getMapper().toDomainModel(entity) : null
    } catch (e) {
      throw new RepositoryError(
        'NotificationRepository findByIdAndUserId error',
        e as Error
      )
    }
  }

  public async findByUserIdAndIsNotDeletedAndCountAll(
    userId: string,
    limit: number,
    offset: number
  ): Promise<{
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
      deletedAt: Date | null
    }>
  }> {
    try {
      const rawNotifications = await this.getQuery<
        Array<{
          total_counts: number
          id: string
          title: string
          content: string
          is_read: boolean
          notification_type: NotificationType
          reference_id: string
          created_at: Date
          updated_at: Date
          deleted_at: Date | null
        }>
      >(
        `
          SELECT
            (SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND deleted_at IS NULL) as total_counts,
            id,
            title,
            content,
            is_read,
            notification_type,
            reference_id,
            created_at,
            updated_at,
            deleted_at
          FROM
            notifications
            WHERE
          user_id = $1 AND deleted_at IS NULL
          ORDER BY created_at DESC
          LIMIT $2
          OFFSET $3
        `,
        [userId, limit, offset]
      )

      return {
        total_counts:
          rawNotifications.length > 0
            ? Number(rawNotifications[0].total_counts)
            : 0,
        notifications: rawNotifications.map((notification) => ({
          id: notification.id,
          title: notification.title,
          content: notification.content,
          isRead: notification.is_read,
          notificationType: notification.notification_type,
          referenceId: notification.reference_id,
          createdAt: notification.created_at,
          updatedAt: notification.updated_at,
          deletedAt: notification.deleted_at,
        })),
      }
    } catch (e) {
      throw new RepositoryError(
        'NotificationRepository findByUserIdAndIsNotDeletedAndCountAll error',
        e as Error
      )
    }
  }

  public async findUnreadAndIsNotDeletedByUserId(
    userId: string
  ): Promise<boolean> {
    try {
      const result = await this.getQuery<
        Array<{
          has_unread_notification: boolean
          deleted_at: string
        }>
      >(
        `SELECT EXISTS (
          SELECT 1
          FROM notifications
          WHERE user_id = $1
            AND is_read = FALSE
            AND deleted_at IS NULL
          LIMIT 1
        ) AS has_unread_notification
        `,
        [userId]
      )

      return result[0].deleted_at == null
        ? result[0].has_unread_notification
        : false
    } catch (e) {
      throw new RepositoryError(
        'NotificationRepository findUnreadByUserId error',
        e as Error
      )
    }
  }

  public async findAllUnreadNotificationsByUserId(
    userId: string
  ): Promise<Notification[]> {
    try {
      const entities = await this.getRepo().find({
        where: {
          user: { id: userId },
          isRead: false,
        },
        relations: ['user'],
      })
      return entities.map((entity) => this.getMapper().toDomainModel(entity))
    } catch (e) {
      throw new RepositoryError(
        'NotificationRepository findAllUnreadNotificationsByUserId error',
        e as Error
      )
    }
  }

  public async findAllByUserId(userId: string): Promise<Notification[]> {
    try {
      const entities = await this.getRepo().find({
        where: {
          user: { id: userId },
        },
        relations: ['user'],
      })
      return entities.map((entity) => this.getMapper().toDomainModel(entity))
    } catch (e) {
      throw new RepositoryError(
        'NotificationRepository findAllByUserId error',
        e as Error
      )
    }
  }

  public async deleteAllByUserId(userId: string): Promise<void> {
    try {
      await this.getRepo()
        .createQueryBuilder('notifications')
        .softDelete()
        .where('userId = :userId', { userId })
        .execute()
    } catch (e) {
      throw new RepositoryError(
        'NotificationRepository deleteAllByUserId error',
        e as Error
      )
    }
  }

  public async delete(
    notification: Notification,
    executor: IExecutor = this.getRepo()
  ): Promise<void> {
    try {
      const entity = this.getMapper().toPersistence(notification)
      await executor.softRemove(entity)
    } catch (e) {
      throw new RepositoryError(
        `NotificationRepository delete error: ${(e as Error).message}`,
        e as Error
      )
    }
  }
}
