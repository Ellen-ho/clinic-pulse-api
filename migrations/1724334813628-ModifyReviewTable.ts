import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyReviewTable1724334813628 implements MigrationInterface {
    name = 'ModifyReviewTable1724334813628'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reviews" ADD "clinicId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_0b99eea44bc9f00848d545ff928" FOREIGN KEY ("clinicId") REFERENCES "clinics"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_0b99eea44bc9f00848d545ff928"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP COLUMN "clinicId"`);
    }

}
