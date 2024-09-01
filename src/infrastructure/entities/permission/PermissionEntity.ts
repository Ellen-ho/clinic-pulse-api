import { UserRoleType } from "../../../domain/user/User";
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("permissions")
export class PermissionEntity {
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  @Column({ name: "role", type: "varchar", length: 50 })
  public role!: UserRoleType;

  @Column({
    name: "dashboard_read",
    type: "boolean",
    default: false,
    nullable: true,
  })
  public dashboardRead!: boolean;

  @Column({
    name: "consultation_read",
    type: "boolean",
    default: false,
    nullable: true,
  })
  public consultationRead!: boolean;

  @Column({
    name: "feedback_survey_read",
    type: "boolean",
    default: false,
    nullable: true,
  })
  public feedbackSurveyRead!: boolean;

  @Column({
    name: "online_review_read",
    type: "boolean",
    default: false,
    nullable: true,
  })
  public onlineReviewRead!: boolean;

  @Column({
    name: "report_center_read",
    type: "boolean",
    default: false,
    nullable: true,
  })
  public reportCenterRead!: boolean;

  @Column({
    name: "time_slot_read",
    type: "boolean",
    default: false,
    nullable: true,
  })
  public timeSlotRead!: boolean;

  @Column({
    name: "staff_management_read",
    type: "boolean",
    default: false,
    nullable: true,
  })
  public staffManagementRead!: boolean;

  @Column({
    name: "staff_management_edit",
    type: "boolean",
    default: false,
    nullable: true,
  })
  public staffManagementEdit!: boolean;

  @Column({
    name: "profile_read",
    type: "boolean",
    default: false,
    nullable: true,
  })
  public profileRead!: boolean;

  @Column({
    name: "profile_edit",
    type: "boolean",
    default: false,
    nullable: true,
  })
  public profileEdit!: boolean;

  @CreateDateColumn({ name: "created_at" })
  public createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  public updatedAt!: Date;
}
