import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFullNameColumnToPatientEntity1723277553083 implements MigrationInterface {
    name = 'AddFullNameColumnToPatientEntity1723277553083'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "patients" ADD "full_name" character varying(50) NOT NULL DEFAULT '-'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "full_name"`);
    }

}
