import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRoomNumberToConsultationRoomEntity1722743543594 implements MigrationInterface {
    name = 'AddRoomNumberToConsultationRoomEntity1722743543594'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consultation_rooms" ADD "room_number" character varying(20) NOT NULL DEFAULT '1'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consultation_rooms" DROP COLUMN "room_number"`);
    }

}
