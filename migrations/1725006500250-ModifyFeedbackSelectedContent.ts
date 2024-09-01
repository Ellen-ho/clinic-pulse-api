import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyFeedbackSelectedContent1725006500250 implements MigrationInterface {
    name = 'ModifyFeedbackSelectedContent1725006500250'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "feedbacks" ALTER COLUMN "selected_content" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "feedbacks" ALTER COLUMN "selected_content" SET NOT NULL`);
    }

}
