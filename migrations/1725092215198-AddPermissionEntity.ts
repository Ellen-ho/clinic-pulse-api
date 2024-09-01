import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPermissionEntity1725092215198 implements MigrationInterface {
    name = 'AddPermissionEntity1725092215198'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "permissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role" character varying(50) NOT NULL, "dashboard_read" boolean DEFAULT false, "consultation_read" boolean DEFAULT false, "feedback_survey_read" boolean DEFAULT false, "online_review_read" boolean DEFAULT false, "report_center_read" boolean DEFAULT false, "time_slot_read" boolean DEFAULT false, "staff_management_read" boolean DEFAULT false, "staff_management_edit" boolean DEFAULT false, "profile_read" boolean DEFAULT false, "profile_edit" boolean DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "permissions"`);
    }

}
