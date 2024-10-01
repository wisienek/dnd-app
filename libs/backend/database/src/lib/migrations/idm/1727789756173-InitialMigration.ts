import type { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1727789756173 implements MigrationInterface {
  name = 'InitialMigration1727789756173';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_basic_auth" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "password" character varying NOT NULL, CONSTRAINT "PK_38689682dba6a8b8c5c352cba42" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "refresh_token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" character varying NOT NULL, "expirationTimestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_b575dd3c21fb0831013c909e7fe" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`CREATE TYPE "public"."user_locale_enum" AS ENUM('en', 'pl')`);
    await queryRunner.query(`CREATE TYPE "public"."user_type_enum" AS ENUM('USER', 'ADMIN')`);
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "locale" "public"."user_locale_enum" NOT NULL DEFAULT 'en', "type" "public"."user_type_enum" NOT NULL DEFAULT 'USER', "isEmailVerified" boolean NOT NULL DEFAULT false, "activateToken" character varying, "resetPasswordToken" character varying, "changeEmailToken" character varying, "deletedDate" TIMESTAMP, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_e0d337fdcc9a83622f22625b4c" ON "user" ("email", "deletedDate") `);
    await queryRunner.query(
      `ALTER TABLE "refresh_token" ADD CONSTRAINT "FK_8e913e288156c133999341156ad" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_8e913e288156c133999341156ad"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_e0d337fdcc9a83622f22625b4c"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "public"."user_type_enum"`);
    await queryRunner.query(`DROP TYPE "public"."user_locale_enum"`);
    await queryRunner.query(`DROP TABLE "refresh_token"`);
    await queryRunner.query(`DROP TABLE "user_basic_auth"`);
  }
}
