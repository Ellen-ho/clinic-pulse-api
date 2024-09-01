import { Permission } from "../../../domain/permission/Permission";
import { PermissionEntity } from "./PermissionEntity";

export class PermissionMapper {
  public toDomainModel(entity: PermissionEntity): Permission {
    return new Permission({
      id: entity.id,
      role: entity.role,
      dashboardRead: entity.dashboardRead,
      consultationRead: entity.consultationRead,
      feedbackSurveyRead: entity.feedbackSurveyRead,
      onlineReviewRead: entity.onlineReviewRead,
      reportCenterRead: entity.reportCenterRead,
      timeSlotRead: entity.timeSlotRead,
      staffManagementRead: entity.staffManagementRead,
      staffManagementEdit: entity.staffManagementEdit,
      profileRead: entity.profileRead,
      profileEdit: entity.profileEdit,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  public toPersistence(domainModel: Permission): PermissionEntity {
    const permissionEntity = new PermissionEntity();
    permissionEntity.id = domainModel.id;
    permissionEntity.role = domainModel.role;
    permissionEntity.dashboardRead = domainModel.dashboardRead;
    permissionEntity.consultationRead = domainModel.consultationRead;
    permissionEntity.feedbackSurveyRead = domainModel.feedbackSurveyRead;
    permissionEntity.onlineReviewRead = domainModel.onlineReviewRead;
    permissionEntity.reportCenterRead = domainModel.reportCenterRead;
    permissionEntity.timeSlotRead = domainModel.timeSlotRead;
    permissionEntity.staffManagementRead = domainModel.staffManagementRead;
    permissionEntity.staffManagementEdit = domainModel.staffManagementEdit;
    permissionEntity.profileRead = domainModel.profileRead;
    permissionEntity.profileEdit = domainModel.profileEdit;
    permissionEntity.createdAt = domainModel.createdAt;
    permissionEntity.updatedAt = domainModel.updatedAt;

    return permissionEntity;
  }
}
