import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFeedbackEntity1723023847535 implements MigrationInterface {
    name = 'AddFeedbackEntity1723023847535'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "feedbacks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "feedback_rating" integer NOT NULL, "selected_content" character varying(255) NOT NULL, "detailed_content" text, "received_at" TIMESTAMP NOT NULL, "consultation_id" uuid NOT NULL, CONSTRAINT "REL_37a04018af610ef8b6837b6c12" UNIQUE ("consultation_id"), CONSTRAINT "PK_79affc530fdd838a9f1e0cc30be" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "feedbacks" ADD CONSTRAINT "FK_37a04018af610ef8b6837b6c128" FOREIGN KEY ("consultation_id") REFERENCES "consultations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "feedbacks" DROP CONSTRAINT "FK_37a04018af610ef8b6837b6c128"`);
        await queryRunner.query(`DROP TABLE "feedbacks"`);
    }

}
