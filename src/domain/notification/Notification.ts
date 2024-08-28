import { User } from '../user/User'

export interface INotificationProps {
  id: string
  isRead: boolean
  title: string
  content: string
  notificationType: NotificationType
  referenceId: string | null
  createdAt: Date
  updatedAt: Date
  user: User
}

export enum NotificationType {
  NEGATIVE_FEEDBACK = 'NEGATIVE_FEEDBACK',
  NEGATIVE_REVIEW = 'NEGATIVE_REVIEW',
  ABNORMAL_CONSULTATION_WAIT_TIME = 'ABNORMAL_CONSULTATION_WAIT_TIME', // reference_id = acupuncture ID
  ABNORMAL_BED_WAIT_TIME = 'ABNORMAL_BED_WAIT_TIME', // reference_id = acupuncture ID
  ABNORMAL_ACUPUNCTURE_WAIT_TIME = 'ABNORMAL_ACUPUNCTURE_WAIT_TIME', // reference_id = acupuncture ID
  ABNORMAL_NEEDLE_REMOVAL_WAIT_TIME = 'ABNORMAL_NEEDLE_REMOVAL_WAIT_TIME', // reference_id = acupuncture ID
  ABNORMAL_MEDICATION_WAIT_TIME = 'ABNORMAL_MEDICATION_WAIT_TIME', // reference_id = medicine ID
  ONSITE_CANCELLATION = 'ONSITE_CANCELLATION', // reference_id = consultation ID
}

export class Notification {
  constructor(private readonly props: INotificationProps) {}

  public get id(): string {
    return this.props.id
  }

  public get isRead(): boolean {
    return this.props.isRead
  }

  public get title(): string {
    return this.props.title
  }

  public get content(): string {
    return this.props.content
  }

  public get notificationType(): NotificationType {
    return this.props.notificationType
  }

  // The reference_id contains different ids based on the notification type

  public get referenceId(): string | null {
    return this.props.referenceId
  }

  public get createdAt(): Date {
    return this.props.createdAt
  }

  public get updatedAt(): Date {
    return this.props.updatedAt
  }

  public get user(): User {
    return this.props.user
  }

  public updateIsRead(isRead: boolean): void {
    this.props.isRead = isRead
  }
}
