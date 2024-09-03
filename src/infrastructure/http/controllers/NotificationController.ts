import { Request, Response } from 'express'
import { GetNotificationListUseCase } from '../../../application/notification/GetNotificationListUseCase'
import { GetNotificationDetailsUseCase } from '../../../application/notification/GetNotificationDetailsUseCase'
import { User } from '../../../domain/user/User'
import { GetNotificationHintsUseCase } from '../../../application/notification/GetNotificationHintsUseCase'
import { ReadAllNotificationsUseCase } from '../../../application/notification/ReadAllNotificationsUseCase'
import { DeleteAllNotificationsUseCase } from '../../../application/notification/DeleteAllNotificationsUseCase'
import { DeleteNotificationUseCase } from '../../../application/notification/DeleteNotificationUseCase'

export interface INotificationController {
  getNotificationList: (req: Request, res: Response) => Promise<Response>
  getNotificationDetails: (req: Request, res: Response) => Promise<Response>
  getNotificationHints: (req: Request, res: Response) => Promise<Response>
  readAllNotifications: (req: Request, res: Response) => Promise<Response>
  deleteAllNotifications: (req: Request, res: Response) => Promise<Response>
  deleteNotification: (req: Request, res: Response) => Promise<Response>
}

export class NotificationController implements INotificationController {
  constructor(
    private readonly getNotificationListUseCase: GetNotificationListUseCase,
    private readonly getNotificationDetailsUseCase: GetNotificationDetailsUseCase,
    private readonly getNotificationHintsUseCase: GetNotificationHintsUseCase,
    private readonly readAllNotificationsUseCase: ReadAllNotificationsUseCase,
    private readonly deleteAllNotificationsUseCase: DeleteAllNotificationsUseCase,
    private readonly deleteNotificationUseCase: DeleteNotificationUseCase
  ) {}

  public getNotificationList = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = {
      user: req.user as User,
      page: req.query.page as string,
      limit: req.query.limit as string,
    }
    const result = await this.getNotificationListUseCase.execute(request)
    return res.status(200).json(result)
  }

  public getNotificationDetails = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = {
      user: req.user as User,
      notificationId: req.params.id,
    }
    const result = await this.getNotificationDetailsUseCase.execute(request)
    return res.status(200).json(result)
  }

  public getNotificationHints = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = {
      user: req.user as User,
    }
    const result = await this.getNotificationHintsUseCase.execute(request)
    return res.status(200).json(result)
  }

  public readAllNotifications = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = {
      user: req.user as User,
    }
    const result = await this.readAllNotificationsUseCase.execute(request)
    return res.status(200).json(result)
  }

  public deleteAllNotifications = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = {
      user: req.user as User,
    }
    const result = await this.deleteAllNotificationsUseCase.execute(request)
    return res.status(200).json(result)
  }

  public deleteNotification = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = {
      user: req.user as User,
      notificationId: req.params.id,
    }
    const result = await this.deleteNotificationUseCase.execute(request)
    return res.status(200).json(result)
  }
}
