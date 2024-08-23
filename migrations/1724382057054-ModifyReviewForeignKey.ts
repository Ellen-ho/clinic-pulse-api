import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyReviewForeignKey1724382057054 implements MigrationInterface {
    name = 'ModifyReviewForeignKey1724382057054'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_0b99eea44bc9f00848d545ff928"`);
        await queryRunner.query(`ALTER TABLE "reviews" RENAME COLUMN "clinicId" TO "clinic_id"`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_c443aef2b47f32cb297b279cfcf" FOREIGN KEY ("clinic_id") REFERENCES "clinics"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_c443aef2b47f32cb297b279cfcf"`);
        await queryRunner.query(`ALTER TABLE "reviews" RENAME COLUMN "clinic_id" TO "clinicId"`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_0b99eea44bc9f00848d545ff928" FOREIGN KEY ("clinicId") REFERENCES "clinics"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
