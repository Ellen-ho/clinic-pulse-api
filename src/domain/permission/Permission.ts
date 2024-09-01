import { UserRoleType } from '../user/User'

export enum PERMISSION {
  DASHBOARD_READ = 'dashboardRead',
  CONSULTATION_READ = 'consultationRead',
  FEEDBACK_SURVEY_READ = 'feedbackSurveyRead',
  ONLINE_REVIEW_READ = 'onlineReviewRead',
  REPORT_CENTER_READ = 'reportCenterRead',
  TIME_SLOT_READ = 'timeSlotRead',
  STAFF_MANAGEMENT_READ = 'staffManagementRead',
  STAFF_MANAGEMENT_EDIT = 'staffManagementEdit',
  PROFILE_READ = 'profileRead',
  PROFILE_EDIT = 'profileEdit',
}

export interface IPermissionProps {
  id: string
  role: UserRoleType
  dashboardRead: boolean
  consultationRead: boolean
  feedbackSurveyRead: boolean
  onlineReviewRead: boolean
  reportCenterRead: boolean
  timeSlotRead: boolean
  staffManagementRead: boolean
  staffManagementEdit: boolean
  profileRead: boolean
  profileEdit: boolean
  createdAt: Date
  updatedAt: Date
}

export class Permission {
  constructor(private readonly props: IPermissionProps) {}

  public get id(): string {
    return this.props.id
  }

  public get role(): UserRoleType {
    return this.props.role
  }

  public get dashboardRead(): boolean {
    return this.props.dashboardRead
  }

  public get consultationRead(): boolean {
    return this.props.consultationRead
  }

  public get feedbackSurveyRead(): boolean {
    return this.props.feedbackSurveyRead
  }

  public get onlineReviewRead(): boolean {
    return this.props.onlineReviewRead
  }

  public get reportCenterRead(): boolean {
    return this.props.reportCenterRead
  }

  public get timeSlotRead(): boolean {
    return this.props.timeSlotRead
  }

  public get staffManagementRead(): boolean {
    return this.props.staffManagementRead
  }

  public get staffManagementEdit(): boolean {
    return this.props.staffManagementEdit
  }

  public get profileRead(): boolean {
    return this.props.profileRead
  }

  public get profileEdit(): boolean {
    return this.props.profileEdit
  }

  public get createdAt(): Date {
    return this.props.createdAt
  }

  public get updatedAt(): Date {
    return this.props.updatedAt
  }
}
