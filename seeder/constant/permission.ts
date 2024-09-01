import { UserRoleType } from "../../src/domain/user/User";

export const PERMISSIONS = [
  {
    id: "441cdd45-1719-4733-a30e-85de78ebb64d",
    role: UserRoleType.ADMIN,
    dashboardRead: true,
    consultationRead: true,
    feedbackSurveyRead: true,
    onlineReviewRead: true,
    reportCenterRead: true,
    timeSlotRead: true,
    staffManagementRead: true,
    staffManagementEdit: true,
    profileRead: false,
    profileEdit: false,
  },
  {
    id: "62932e2b-4833-49ba-a13f-75f6244c9dee",
    role: UserRoleType.DOCTOR,
    dashboardRead: true,
    consultationRead: true,
    feedbackSurveyRead: true,
    onlineReviewRead: false,
    reportCenterRead: true,
    timeSlotRead: true,
    staffManagementRead: false,
    staffManagementEdit: false,
    profileRead: true,
    profileEdit: true,
  },
];
