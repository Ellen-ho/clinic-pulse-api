import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDoctorEntity1722676340395 implements MigrationInterface {
    name = 'AddDoctorEntity1722676340395'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "doctors" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "avatar" character varying(255), "first_name" character varying(50) NOT NULL, "last_name" character varying(50) NOT NULL, "gender" character varying(20) NOT NULL, "birth_date" TIMESTAMP NOT NULL, "onboard_date" TIMESTAMP NOT NULL, "resignation_date" date, "user_id" uuid NOT NULL, CONSTRAINT "REL_653c27d1b10652eb0c7bbbc442" UNIQUE ("user_id"), CONSTRAINT "PK_8207e7889b50ee3695c2b8154ff" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "doctors" ADD CONSTRAINT "FK_653c27d1b10652eb0c7bbbc4427" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "doctors" DROP CONSTRAINT "FK_653c27d1b10652eb0c7bbbc4427"`);
        await queryRunner.query(`DROP TABLE "doctors"`);
    }

}
