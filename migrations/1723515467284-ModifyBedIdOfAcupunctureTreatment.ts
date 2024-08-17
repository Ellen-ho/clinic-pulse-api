import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyBedIdOfAcupunctureTreatment1723515467284 implements MigrationInterface {
    name = 'ModifyBedIdOfAcupunctureTreatment1723515467284'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "acupuncture_treatments" DROP CONSTRAINT "UQ_a460dec99c4366ace06df4363f3"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "acupuncture_treatments" ADD CONSTRAINT "UQ_a460dec99c4366ace06df4363f3" UNIQUE ("bed_id")`);
    }

}
