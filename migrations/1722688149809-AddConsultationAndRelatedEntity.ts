import { MigrationInterface, QueryRunner } from "typeorm";

export class AddConsultationAndRelatedEntity1722688149809 implements MigrationInterface {
    name = 'AddConsultationAndRelatedEntity1722688149809'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "patients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying(50) NOT NULL, "last_name" character varying(50) NOT NULL, "gender" character varying(20) NOT NULL, "birth_date" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a7f0b9fcbb3469d5ec0b0aceaa7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "clinics" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, "address" jsonb NOT NULL, CONSTRAINT "PK_5513b659e4d12b01a8ab3956abc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "consultation_rooms" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "clinic_id" uuid NOT NULL, CONSTRAINT "PK_f32c1535abe4dfb722b343b857f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "time_slots" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "start_at" TIMESTAMP NOT NULL, "end_at" TIMESTAMP NOT NULL, "time_period" character varying(50) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "doctor_id" uuid NOT NULL, "clinic_id" uuid NOT NULL, "consultation_room_id" uuid NOT NULL, CONSTRAINT "PK_f87c73d8648c3f3f297adba3cb8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "medicine_treatments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "get_medicine_at" TIMESTAMP, CONSTRAINT "PK_3535dd28fd19a83e658d29a0d4a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "acupuncture_treatments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "start_at" TIMESTAMP, "end_at" TIMESTAMP, "bed_id" character varying, "assign_bed_at" TIMESTAMP, "remove_needle_at" TIMESTAMP, "needle_counts" integer, CONSTRAINT "UQ_a460dec99c4366ace06df4363f3" UNIQUE ("bed_id"), CONSTRAINT "PK_10bc4e3f78981288e7ca8b5f439" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "consultations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "source" character varying(50) NOT NULL, "consultation_number" integer NOT NULL, "check_in_at" TIMESTAMP NOT NULL, "start_at" TIMESTAMP, "end_at" TIMESTAMP, "check_out_at" TIMESTAMP, "onsite_cancle_at" TIMESTAMP, "onsite_cancle_reason" character varying(255), "patient_id" uuid NOT NULL, "time_slot_id" uuid NOT NULL, "acupuncture_treatment_id" uuid, "medicine_treatment_id" uuid, CONSTRAINT "REL_11e59cd8c875d9ea2029069faf" UNIQUE ("acupuncture_treatment_id"), CONSTRAINT "REL_c7f43a4e05f00a713b58384414" UNIQUE ("medicine_treatment_id"), CONSTRAINT "PK_c5b78e9424d9bc68464f6a12103" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "consultation_rooms" ADD CONSTRAINT "FK_477279275ae2c3bed6b3d1274a1" FOREIGN KEY ("clinic_id") REFERENCES "clinics"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "time_slots" ADD CONSTRAINT "FK_ff8f3d807d815fc235f56a518af" FOREIGN KEY ("doctor_id") REFERENCES "doctors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "time_slots" ADD CONSTRAINT "FK_e08cc37f0975049d07d35e7ddd6" FOREIGN KEY ("clinic_id") REFERENCES "clinics"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "time_slots" ADD CONSTRAINT "FK_48a5a1d9c12b881282bc0e3e432" FOREIGN KEY ("consultation_room_id") REFERENCES "consultation_rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "consultations" ADD CONSTRAINT "FK_11e59cd8c875d9ea2029069faf1" FOREIGN KEY ("acupuncture_treatment_id") REFERENCES "acupuncture_treatments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "consultations" ADD CONSTRAINT "FK_c7f43a4e05f00a713b58384414f" FOREIGN KEY ("medicine_treatment_id") REFERENCES "medicine_treatments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "consultations" ADD CONSTRAINT "FK_ee6c335246d3b937f11c329c837" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "consultations" ADD CONSTRAINT "FK_a0b2df522b233bca3a2c108964b" FOREIGN KEY ("time_slot_id") REFERENCES "time_slots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consultations" DROP CONSTRAINT "FK_a0b2df522b233bca3a2c108964b"`);
        await queryRunner.query(`ALTER TABLE "consultations" DROP CONSTRAINT "FK_ee6c335246d3b937f11c329c837"`);
        await queryRunner.query(`ALTER TABLE "consultations" DROP CONSTRAINT "FK_c7f43a4e05f00a713b58384414f"`);
        await queryRunner.query(`ALTER TABLE "consultations" DROP CONSTRAINT "FK_11e59cd8c875d9ea2029069faf1"`);
        await queryRunner.query(`ALTER TABLE "time_slots" DROP CONSTRAINT "FK_48a5a1d9c12b881282bc0e3e432"`);
        await queryRunner.query(`ALTER TABLE "time_slots" DROP CONSTRAINT "FK_e08cc37f0975049d07d35e7ddd6"`);
        await queryRunner.query(`ALTER TABLE "time_slots" DROP CONSTRAINT "FK_ff8f3d807d815fc235f56a518af"`);
        await queryRunner.query(`ALTER TABLE "consultation_rooms" DROP CONSTRAINT "FK_477279275ae2c3bed6b3d1274a1"`);
        await queryRunner.query(`DROP TABLE "consultations"`);
        await queryRunner.query(`DROP TABLE "acupuncture_treatments"`);
        await queryRunner.query(`DROP TABLE "medicine_treatments"`);
        await queryRunner.query(`DROP TABLE "time_slots"`);
        await queryRunner.query(`DROP TABLE "consultation_rooms"`);
        await queryRunner.query(`DROP TABLE "clinics"`);
        await queryRunner.query(`DROP TABLE "patients"`);
    }

}
