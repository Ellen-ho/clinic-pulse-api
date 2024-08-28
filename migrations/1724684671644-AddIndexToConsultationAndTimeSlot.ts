import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIndexToConsultationAndTimeSlot1724684671644 implements MigrationInterface {
    name = 'AddIndexToConsultationAndTimeSlot1724684671644'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_CLINIC_CONSULTATION_ROOM" ON "time_slots" ("clinic_id", "consultation_room_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_DOCTOR_ID" ON "time_slots" ("doctor_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_CHECK_IN_AT_TIME_SLOT_ID" ON "consultations" ("check_in_at", "time_slot_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_CHECK_IN_AT_TIME_SLOT_ID"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_DOCTOR_ID"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_CLINIC_CONSULTATION_ROOM"`);
    }

}
