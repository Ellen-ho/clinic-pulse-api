import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifySpellingOfCancel1722933588910 implements MigrationInterface {
    name = 'ModifySpellingOfCancel1722933588910'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consultations" DROP COLUMN "onsite_cancle_at"`);
        await queryRunner.query(`ALTER TABLE "consultations" DROP COLUMN "onsite_cancle_reason"`);
        await queryRunner.query(`ALTER TABLE "consultations" ADD "onsite_cancel_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "consultations" ADD "onsite_cancel_reason" character varying(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consultations" DROP COLUMN "onsite_cancel_reason"`);
        await queryRunner.query(`ALTER TABLE "consultations" DROP COLUMN "onsite_cancel_at"`);
        await queryRunner.query(`ALTER TABLE "consultations" ADD "onsite_cancle_reason" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "consultations" ADD "onsite_cancle_at" TIMESTAMP`);
    }

}
