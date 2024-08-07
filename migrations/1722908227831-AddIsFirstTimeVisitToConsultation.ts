import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsFirstTimeVisitToConsultation1722908227831 implements MigrationInterface {
    name = 'AddIsFirstTimeVisitToConsultation1722908227831'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consultations" ADD "is_first_time_visit" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consultations" DROP COLUMN "is_first_time_visit"`);
    }

}
