import { MigrationInterface, QueryRunner } from "typeorm";

export class AddReviewEntity1724311348456 implements MigrationInterface {
    name = 'AddReviewEntity1724311348456'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "reviews" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "link" character varying(255) NOT NULL, "rating" integer NOT NULL, "date" character varying(30) NOT NULL, "iso_date" TIMESTAMP NOT NULL, "iso_date_of_last_edit" TIMESTAMP, "reviewer_name" character varying(255) NOT NULL, "reviewer_link" character varying(255) NOT NULL, "reviewer_local_guide" boolean NOT NULL, "snippet" text, "extracted_snippet" text, "likes" integer, "response_date" character varying(50), "response_iso_date" TIMESTAMP, "response_iso_date_of_last_edit" TIMESTAMP, "response_snippet" text, "response_extracted_snippet" text, CONSTRAINT "PK_231ae565c273ee700b283f15c1d" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "reviews"`);
    }

}
