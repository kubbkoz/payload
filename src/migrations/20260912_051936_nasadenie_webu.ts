import { sql } from '@payloadcms/db-postgres'
import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_projekty_nasadenie_stav" AS ENUM('nenasadene', 'hotovo', 'chyba');
  ALTER TABLE "projekty" ALTER COLUMN "farba" SET DEFAULT '#00cfff';
  ALTER TABLE "projekty" ADD COLUMN "nasadit_web" boolean DEFAULT false;
  ALTER TABLE "projekty" ADD COLUMN "nasadenie_stav" "enum_projekty_nasadenie_stav";
  ALTER TABLE "projekty" ADD COLUMN "nasadenie_repozitar" varchar;
  ALTER TABLE "projekty" ADD COLUMN "nasadenie_adresa" varchar;
  ALTER TABLE "projekty" ADD COLUMN "nasadenie_poznamka" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projekty" ALTER COLUMN "farba" SET DEFAULT '#2f6f4e';
  ALTER TABLE "projekty" DROP COLUMN "nasadit_web";
  ALTER TABLE "projekty" DROP COLUMN "nasadenie_stav";
  ALTER TABLE "projekty" DROP COLUMN "nasadenie_repozitar";
  ALTER TABLE "projekty" DROP COLUMN "nasadenie_adresa";
  ALTER TABLE "projekty" DROP COLUMN "nasadenie_poznamka";
  DROP TYPE "public"."enum_projekty_nasadenie_stav";`)
}
