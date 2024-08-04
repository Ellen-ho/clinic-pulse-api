import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStatusToConsultationEntity1722745345680 implements MigrationInterface {
    name = 'AddStatusToConsultationEntity1722745345680'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consultations" ADD "status" character varying(255) NOT NULL DEFAULT 'WAITING_FOR_CONSULTATION'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consultations" DROP COLUMN "status"`);
    }

}
