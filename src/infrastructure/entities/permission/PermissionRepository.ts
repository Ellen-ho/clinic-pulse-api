import { BaseRepository } from '../../../infrastructure/database/BaseRepository'
import { PermissionEntity } from './PermissionEntity'
import { Permission } from '../../../domain/permission/Permission'
import { IPermissionRepository } from '../../../domain/permission/interfaces/repositories/IPermissionRepository'
import { DataSource } from 'typeorm'
import { PermissionMapper } from './PermissionMapper'
import { UserRoleType } from '../../../domain/user/User'
import { RepositoryError } from '../../../infrastructure/error/RepositoryError'

export class PermissionRepository
  extends BaseRepository<PermissionEntity, Permission>
  implements IPermissionRepository
{
  constructor(dataSource: DataSource) {
    super(PermissionEntity, new PermissionMapper(), dataSource)
  }

  public async findByRole(role: UserRoleType): Promise<Permission | null> {
    try {
      const rawPermissions = await this.getQuery<
        Array<{
          id: string
          role: string
          dashboard_read: boolean
          consultation_read: boolean
          feedback_survey_read: boolean
          online_review_read: boolean
          report_center_read: boolean
          time_slot_read: boolean
          staff_management_read: boolean
          staff_management_edit: boolean
          profile_read: boolean
          profile_edit: boolean
          created_at: Date
          updated_at: Date
        }>
      >(`SELECT * FROM permissions WHERE role = $1`, [role])

      if (rawPermissions.length === 0) {
        return null
      }

      const {
        id,
        role: rawRole,
        dashboard_read,
        consultation_read,
        feedback_survey_read,
        online_review_read,
        report_center_read,
        time_slot_read,
        staff_management_read,
        staff_management_edit,
        profile_read,
        profile_edit,
        created_at,
        updated_at,
      } = rawPermissions[0]

      return {
        id,
        role: rawRole as UserRoleType,
        dashboardRead: dashboard_read,
        consultationRead: consultation_read,
        feedbackSurveyRead: feedback_survey_read,
        onlineReviewRead: online_review_read,
        reportCenterRead: report_center_read,
        timeSlotRead: time_slot_read,
        staffManagementRead: staff_management_read,
        staffManagementEdit: staff_management_edit,
        profileRead: profile_read,
        profileEdit: profile_edit,
        createdAt: created_at,
        updatedAt: updated_at,
      } as Permission
    } catch (e) {
      throw new RepositoryError(
        'PermissionRepository findByRole error',
        e as Error
      )
    }
  }
}
