import { sql } from '@payloadcms/db-postgres'
import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_stranky_blocks_hero_tlacidla_styl" AS ENUM('hlavne', 'vedlajsie', 'odkaz');
  CREATE TYPE "public"."enum_stranky_blocks_hero_varianta" AS ENUM('plny', 'pas', 'split');
  CREATE TYPE "public"."enum_stranky_blocks_text_sirka" AS ENUM('uzka', 'siroka');
  CREATE TYPE "public"."enum_stranky_blocks_obrazok_sirka" AS ENUM('obsah', 'plna');
  CREATE TYPE "public"."enum_stranky_blocks_galeria_rozlozenie" AS ENUM('mriezka', 'pas', 'mozaika');
  CREATE TYPE "public"."enum_stranky_blocks_vypis_zdroj" AS ENUM('prispevky', 'katalog', 'udalosti');
  CREATE TYPE "public"."enum_stranky_blocks_vypis_rozlozenie" AS ENUM('karty', 'zoznam', 'kolotoc');
  CREATE TYPE "public"."enum_stranky_blocks_cta_tlacidla_styl" AS ENUM('hlavne', 'vedlajsie', 'odkaz');
  CREATE TYPE "public"."enum_stranky_blocks_cta_varianta" AS ENUM('pas', 'karta');
  CREATE TYPE "public"."enum_stranky_blocks_oddelovac_velkost" AS ENUM('mala', 'stredna', 'velka');
  CREATE TYPE "public"."enum_stranky_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__stranky_v_blocks_hero_tlacidla_styl" AS ENUM('hlavne', 'vedlajsie', 'odkaz');
  CREATE TYPE "public"."enum__stranky_v_blocks_hero_varianta" AS ENUM('plny', 'pas', 'split');
  CREATE TYPE "public"."enum__stranky_v_blocks_text_sirka" AS ENUM('uzka', 'siroka');
  CREATE TYPE "public"."enum__stranky_v_blocks_obrazok_sirka" AS ENUM('obsah', 'plna');
  CREATE TYPE "public"."enum__stranky_v_blocks_galeria_rozlozenie" AS ENUM('mriezka', 'pas', 'mozaika');
  CREATE TYPE "public"."enum__stranky_v_blocks_vypis_zdroj" AS ENUM('prispevky', 'katalog', 'udalosti');
  CREATE TYPE "public"."enum__stranky_v_blocks_vypis_rozlozenie" AS ENUM('karty', 'zoznam', 'kolotoc');
  CREATE TYPE "public"."enum__stranky_v_blocks_cta_tlacidla_styl" AS ENUM('hlavne', 'vedlajsie', 'odkaz');
  CREATE TYPE "public"."enum__stranky_v_blocks_cta_varianta" AS ENUM('pas', 'karta');
  CREATE TYPE "public"."enum__stranky_v_blocks_oddelovac_velkost" AS ENUM('mala', 'stredna', 'velka');
  CREATE TYPE "public"."enum__stranky_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_prispevky_blocks_hero_tlacidla_styl" AS ENUM('hlavne', 'vedlajsie', 'odkaz');
  CREATE TYPE "public"."enum_prispevky_blocks_hero_varianta" AS ENUM('plny', 'pas', 'split');
  CREATE TYPE "public"."enum_prispevky_blocks_text_sirka" AS ENUM('uzka', 'siroka');
  CREATE TYPE "public"."enum_prispevky_blocks_obrazok_sirka" AS ENUM('obsah', 'plna');
  CREATE TYPE "public"."enum_prispevky_blocks_galeria_rozlozenie" AS ENUM('mriezka', 'pas', 'mozaika');
  CREATE TYPE "public"."enum_prispevky_blocks_vypis_zdroj" AS ENUM('prispevky', 'katalog', 'udalosti');
  CREATE TYPE "public"."enum_prispevky_blocks_vypis_rozlozenie" AS ENUM('karty', 'zoznam', 'kolotoc');
  CREATE TYPE "public"."enum_prispevky_blocks_cta_tlacidla_styl" AS ENUM('hlavne', 'vedlajsie', 'odkaz');
  CREATE TYPE "public"."enum_prispevky_blocks_cta_varianta" AS ENUM('pas', 'karta');
  CREATE TYPE "public"."enum_prispevky_blocks_oddelovac_velkost" AS ENUM('mala', 'stredna', 'velka');
  CREATE TYPE "public"."enum_prispevky_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__prispevky_v_blocks_hero_tlacidla_styl" AS ENUM('hlavne', 'vedlajsie', 'odkaz');
  CREATE TYPE "public"."enum__prispevky_v_blocks_hero_varianta" AS ENUM('plny', 'pas', 'split');
  CREATE TYPE "public"."enum__prispevky_v_blocks_text_sirka" AS ENUM('uzka', 'siroka');
  CREATE TYPE "public"."enum__prispevky_v_blocks_obrazok_sirka" AS ENUM('obsah', 'plna');
  CREATE TYPE "public"."enum__prispevky_v_blocks_galeria_rozlozenie" AS ENUM('mriezka', 'pas', 'mozaika');
  CREATE TYPE "public"."enum__prispevky_v_blocks_vypis_zdroj" AS ENUM('prispevky', 'katalog', 'udalosti');
  CREATE TYPE "public"."enum__prispevky_v_blocks_vypis_rozlozenie" AS ENUM('karty', 'zoznam', 'kolotoc');
  CREATE TYPE "public"."enum__prispevky_v_blocks_cta_tlacidla_styl" AS ENUM('hlavne', 'vedlajsie', 'odkaz');
  CREATE TYPE "public"."enum__prispevky_v_blocks_cta_varianta" AS ENUM('pas', 'karta');
  CREATE TYPE "public"."enum__prispevky_v_blocks_oddelovac_velkost" AS ENUM('mala', 'stredna', 'velka');
  CREATE TYPE "public"."enum__prispevky_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_katalog_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__katalog_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_udalosti_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__udalosti_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_kategorie_pre" AS ENUM('prispevky', 'katalog', 'udalosti');
  CREATE TYPE "public"."enum_navigacia_polozky_podpolozky_typ" AS ENUM('stranka', 'adresa');
  CREATE TYPE "public"."enum_navigacia_polozky_typ" AS ENUM('stranka', 'adresa');
  CREATE TYPE "public"."enum_navigacia_umiestnenie" AS ENUM('hlavicka', 'paticka', 'vedlajsie');
  CREATE TYPE "public"."enum_nastavenia_webu_siete_siet" AS ENUM('instagram', 'facebook', 'tiktok', 'youtube', 'linkedin', 'ine');
  CREATE TYPE "public"."enum_formulare_polia_typ" AS ENUM('text', 'textarea', 'email', 'tel', 'cislo', 'datum', 'vyber', 'zaskrtnutie', 'suhlas');
  CREATE TYPE "public"."enum_odpovede_stav" AS ENUM('nove', 'vybavene', 'spam');
  CREATE TYPE "public"."enum_zaznamy_akcia" AS ENUM('vytvorenie', 'uprava', 'zverejnenie', 'zmazanie');
  CREATE TYPE "public"."enum_projekty_stav" AS ENUM('aktivny', 'vystavba', 'pozastaveny', 'archiv');
  CREATE TYPE "public"."enum_users_pristupy_rola" AS ENUM('spravca', 'editor', 'autor', 'pozorovatel');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TABLE "stranky_blocks_hero_tlacidla" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"odkaz" varchar,
  	"styl" "enum_stranky_blocks_hero_tlacidla_styl" DEFAULT 'hlavne'
  );
  
  CREATE TABLE "stranky_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"nadpis" varchar,
  	"podnadpis" varchar,
  	"pozadie_id" integer,
  	"varianta" "enum_stranky_blocks_hero_varianta" DEFAULT 'plny',
  	"block_name" varchar
  );
  
  CREATE TABLE "stranky_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"nadpis" varchar,
  	"obsah" jsonb,
  	"sirka" "enum_stranky_blocks_text_sirka" DEFAULT 'uzka',
  	"block_name" varchar
  );
  
  CREATE TABLE "stranky_blocks_obrazok" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"obrazok_id" integer,
  	"popisok" varchar,
  	"sirka" "enum_stranky_blocks_obrazok_sirka" DEFAULT 'obsah',
  	"block_name" varchar
  );
  
  CREATE TABLE "stranky_blocks_galeria" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"nadpis" varchar,
  	"rozlozenie" "enum_stranky_blocks_galeria_rozlozenie" DEFAULT 'mriezka',
  	"block_name" varchar
  );
  
  CREATE TABLE "stranky_blocks_vypis" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"nadpis" varchar,
  	"zdroj" "enum_stranky_blocks_vypis_zdroj" DEFAULT 'prispevky',
  	"kategoria_id" integer,
  	"pocet" numeric DEFAULT 6,
  	"rozlozenie" "enum_stranky_blocks_vypis_rozlozenie" DEFAULT 'karty',
  	"odkaz_na_vsetko" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "stranky_blocks_dlazdice_polozky" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"nadpis" varchar,
  	"text" varchar,
  	"ikona_id" integer,
  	"odkaz" varchar
  );
  
  CREATE TABLE "stranky_blocks_dlazdice" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"nadpis" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "stranky_blocks_cta_tlacidla" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"odkaz" varchar,
  	"styl" "enum_stranky_blocks_cta_tlacidla_styl" DEFAULT 'hlavne'
  );
  
  CREATE TABLE "stranky_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"nadpis" varchar,
  	"text" varchar,
  	"varianta" "enum_stranky_blocks_cta_varianta" DEFAULT 'pas',
  	"block_name" varchar
  );
  
  CREATE TABLE "stranky_blocks_faq_otazky" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"otazka" varchar,
  	"odpoved" varchar
  );
  
  CREATE TABLE "stranky_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"nadpis" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "stranky_blocks_formular" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"nadpis" varchar,
  	"text" varchar,
  	"formular_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "stranky_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"nadpis" varchar,
  	"adresa" varchar,
  	"subor_id" integer,
  	"nahlad_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "stranky_blocks_kod" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kod" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "stranky_blocks_oddelovac" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"velkost" "enum_stranky_blocks_oddelovac_velkost" DEFAULT 'stredna',
  	"ciara" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "stranky" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"projekt_id" integer,
  	"nazov" varchar,
  	"cesta" varchar,
  	"perex" varchar,
  	"seo_titulok" varchar,
  	"seo_popis" varchar,
  	"seo_obrazok_id" integer,
  	"seo_neindexovat" boolean DEFAULT false,
  	"vytvoril_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_stranky_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "stranky_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "_stranky_v_blocks_hero_tlacidla" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"odkaz" varchar,
  	"styl" "enum__stranky_v_blocks_hero_tlacidla_styl" DEFAULT 'hlavne',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_stranky_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"nadpis" varchar,
  	"podnadpis" varchar,
  	"pozadie_id" integer,
  	"varianta" "enum__stranky_v_blocks_hero_varianta" DEFAULT 'plny',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_stranky_v_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"nadpis" varchar,
  	"obsah" jsonb,
  	"sirka" "enum__stranky_v_blocks_text_sirka" DEFAULT 'uzka',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_stranky_v_blocks_obrazok" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"obrazok_id" integer,
  	"popisok" varchar,
  	"sirka" "enum__stranky_v_blocks_obrazok_sirka" DEFAULT 'obsah',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_stranky_v_blocks_galeria" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"nadpis" varchar,
  	"rozlozenie" "enum__stranky_v_blocks_galeria_rozlozenie" DEFAULT 'mriezka',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_stranky_v_blocks_vypis" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"nadpis" varchar,
  	"zdroj" "enum__stranky_v_blocks_vypis_zdroj" DEFAULT 'prispevky',
  	"kategoria_id" integer,
  	"pocet" numeric DEFAULT 6,
  	"rozlozenie" "enum__stranky_v_blocks_vypis_rozlozenie" DEFAULT 'karty',
  	"odkaz_na_vsetko" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_stranky_v_blocks_dlazdice_polozky" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"nadpis" varchar,
  	"text" varchar,
  	"ikona_id" integer,
  	"odkaz" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_stranky_v_blocks_dlazdice" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"nadpis" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_stranky_v_blocks_cta_tlacidla" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"odkaz" varchar,
  	"styl" "enum__stranky_v_blocks_cta_tlacidla_styl" DEFAULT 'hlavne',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_stranky_v_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"nadpis" varchar,
  	"text" varchar,
  	"varianta" "enum__stranky_v_blocks_cta_varianta" DEFAULT 'pas',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_stranky_v_blocks_faq_otazky" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"otazka" varchar,
  	"odpoved" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_stranky_v_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"nadpis" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_stranky_v_blocks_formular" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"nadpis" varchar,
  	"text" varchar,
  	"formular_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_stranky_v_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"nadpis" varchar,
  	"adresa" varchar,
  	"subor_id" integer,
  	"nahlad_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_stranky_v_blocks_kod" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kod" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_stranky_v_blocks_oddelovac" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"velkost" "enum__stranky_v_blocks_oddelovac_velkost" DEFAULT 'stredna',
  	"ciara" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_stranky_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_projekt_id" integer,
  	"version_nazov" varchar,
  	"version_cesta" varchar,
  	"version_perex" varchar,
  	"version_seo_titulok" varchar,
  	"version_seo_popis" varchar,
  	"version_seo_obrazok_id" integer,
  	"version_seo_neindexovat" boolean DEFAULT false,
  	"version_vytvoril_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__stranky_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_stranky_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "prispevky_blocks_hero_tlacidla" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"odkaz" varchar,
  	"styl" "enum_prispevky_blocks_hero_tlacidla_styl" DEFAULT 'hlavne'
  );
  
  CREATE TABLE "prispevky_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"nadpis" varchar,
  	"podnadpis" varchar,
  	"pozadie_id" integer,
  	"varianta" "enum_prispevky_blocks_hero_varianta" DEFAULT 'plny',
  	"block_name" varchar
  );
  
  CREATE TABLE "prispevky_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"nadpis" varchar,
  	"obsah" jsonb,
  	"sirka" "enum_prispevky_blocks_text_sirka" DEFAULT 'uzka',
  	"block_name" varchar
  );
  
  CREATE TABLE "prispevky_blocks_obrazok" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"obrazok_id" integer,
  	"popisok" varchar,
  	"sirka" "enum_prispevky_blocks_obrazok_sirka" DEFAULT 'obsah',
  	"block_name" varchar
  );
  
  CREATE TABLE "prispevky_blocks_galeria" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"nadpis" varchar,
  	"rozlozenie" "enum_prispevky_blocks_galeria_rozlozenie" DEFAULT 'mriezka',
  	"block_name" varchar
  );
  
  CREATE TABLE "prispevky_blocks_vypis" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"nadpis" varchar,
  	"zdroj" "enum_prispevky_blocks_vypis_zdroj" DEFAULT 'prispevky',
  	"kategoria_id" integer,
  	"pocet" numeric DEFAULT 6,
  	"rozlozenie" "enum_prispevky_blocks_vypis_rozlozenie" DEFAULT 'karty',
  	"odkaz_na_vsetko" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "prispevky_blocks_dlazdice_polozky" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"nadpis" varchar,
  	"text" varchar,
  	"ikona_id" integer,
  	"odkaz" varchar
  );
  
  CREATE TABLE "prispevky_blocks_dlazdice" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"nadpis" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "prispevky_blocks_cta_tlacidla" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"odkaz" varchar,
  	"styl" "enum_prispevky_blocks_cta_tlacidla_styl" DEFAULT 'hlavne'
  );
  
  CREATE TABLE "prispevky_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"nadpis" varchar,
  	"text" varchar,
  	"varianta" "enum_prispevky_blocks_cta_varianta" DEFAULT 'pas',
  	"block_name" varchar
  );
  
  CREATE TABLE "prispevky_blocks_faq_otazky" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"otazka" varchar,
  	"odpoved" varchar
  );
  
  CREATE TABLE "prispevky_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"nadpis" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "prispevky_blocks_formular" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"nadpis" varchar,
  	"text" varchar,
  	"formular_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "prispevky_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"nadpis" varchar,
  	"adresa" varchar,
  	"subor_id" integer,
  	"nahlad_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "prispevky_blocks_kod" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kod" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "prispevky_blocks_oddelovac" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"velkost" "enum_prispevky_blocks_oddelovac_velkost" DEFAULT 'stredna',
  	"ciara" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "prispevky" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"projekt_id" integer,
  	"nazov" varchar,
  	"slug" varchar,
  	"datum" timestamp(3) with time zone,
  	"autor_text" varchar,
  	"perex" varchar,
  	"obrazok_id" integer,
  	"obsah" jsonb,
  	"odporucany" boolean DEFAULT false,
  	"seo_titulok" varchar,
  	"seo_popis" varchar,
  	"seo_obrazok_id" integer,
  	"seo_neindexovat" boolean DEFAULT false,
  	"vytvoril_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_prispevky_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "prispevky_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"kategorie_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "_prispevky_v_blocks_hero_tlacidla" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"odkaz" varchar,
  	"styl" "enum__prispevky_v_blocks_hero_tlacidla_styl" DEFAULT 'hlavne',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_prispevky_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"nadpis" varchar,
  	"podnadpis" varchar,
  	"pozadie_id" integer,
  	"varianta" "enum__prispevky_v_blocks_hero_varianta" DEFAULT 'plny',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_prispevky_v_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"nadpis" varchar,
  	"obsah" jsonb,
  	"sirka" "enum__prispevky_v_blocks_text_sirka" DEFAULT 'uzka',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_prispevky_v_blocks_obrazok" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"obrazok_id" integer,
  	"popisok" varchar,
  	"sirka" "enum__prispevky_v_blocks_obrazok_sirka" DEFAULT 'obsah',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_prispevky_v_blocks_galeria" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"nadpis" varchar,
  	"rozlozenie" "enum__prispevky_v_blocks_galeria_rozlozenie" DEFAULT 'mriezka',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_prispevky_v_blocks_vypis" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"nadpis" varchar,
  	"zdroj" "enum__prispevky_v_blocks_vypis_zdroj" DEFAULT 'prispevky',
  	"kategoria_id" integer,
  	"pocet" numeric DEFAULT 6,
  	"rozlozenie" "enum__prispevky_v_blocks_vypis_rozlozenie" DEFAULT 'karty',
  	"odkaz_na_vsetko" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_prispevky_v_blocks_dlazdice_polozky" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"nadpis" varchar,
  	"text" varchar,
  	"ikona_id" integer,
  	"odkaz" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_prispevky_v_blocks_dlazdice" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"nadpis" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_prispevky_v_blocks_cta_tlacidla" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"odkaz" varchar,
  	"styl" "enum__prispevky_v_blocks_cta_tlacidla_styl" DEFAULT 'hlavne',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_prispevky_v_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"nadpis" varchar,
  	"text" varchar,
  	"varianta" "enum__prispevky_v_blocks_cta_varianta" DEFAULT 'pas',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_prispevky_v_blocks_faq_otazky" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"otazka" varchar,
  	"odpoved" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_prispevky_v_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"nadpis" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_prispevky_v_blocks_formular" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"nadpis" varchar,
  	"text" varchar,
  	"formular_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_prispevky_v_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"nadpis" varchar,
  	"adresa" varchar,
  	"subor_id" integer,
  	"nahlad_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_prispevky_v_blocks_kod" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kod" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_prispevky_v_blocks_oddelovac" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"velkost" "enum__prispevky_v_blocks_oddelovac_velkost" DEFAULT 'stredna',
  	"ciara" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_prispevky_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_projekt_id" integer,
  	"version_nazov" varchar,
  	"version_slug" varchar,
  	"version_datum" timestamp(3) with time zone,
  	"version_autor_text" varchar,
  	"version_perex" varchar,
  	"version_obrazok_id" integer,
  	"version_obsah" jsonb,
  	"version_odporucany" boolean DEFAULT false,
  	"version_seo_titulok" varchar,
  	"version_seo_popis" varchar,
  	"version_seo_obrazok_id" integer,
  	"version_seo_neindexovat" boolean DEFAULT false,
  	"version_vytvoril_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__prispevky_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_prispevky_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"kategorie_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "katalog_vlastnosti" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"nazov" varchar,
  	"hodnota" varchar
  );
  
  CREATE TABLE "katalog" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"projekt_id" integer,
  	"nazov" varchar,
  	"slug" varchar,
  	"perex" varchar,
  	"cena" varchar,
  	"cena_cislo" numeric,
  	"jednotka" varchar,
  	"kategoria_id" integer,
  	"obrazok_id" integer,
  	"popis" jsonb,
  	"dostupne" boolean DEFAULT true,
  	"odporucane" boolean DEFAULT false,
  	"poradie" numeric DEFAULT 0,
  	"seo_titulok" varchar,
  	"seo_popis" varchar,
  	"seo_obrazok_id" integer,
  	"seo_neindexovat" boolean DEFAULT false,
  	"vytvoril_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_katalog_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "katalog_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "_katalog_v_version_vlastnosti" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"nazov" varchar,
  	"hodnota" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_katalog_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_projekt_id" integer,
  	"version_nazov" varchar,
  	"version_slug" varchar,
  	"version_perex" varchar,
  	"version_cena" varchar,
  	"version_cena_cislo" numeric,
  	"version_jednotka" varchar,
  	"version_kategoria_id" integer,
  	"version_obrazok_id" integer,
  	"version_popis" jsonb,
  	"version_dostupne" boolean DEFAULT true,
  	"version_odporucane" boolean DEFAULT false,
  	"version_poradie" numeric DEFAULT 0,
  	"version_seo_titulok" varchar,
  	"version_seo_popis" varchar,
  	"version_seo_obrazok_id" integer,
  	"version_seo_neindexovat" boolean DEFAULT false,
  	"version_vytvoril_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__katalog_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_katalog_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "udalosti" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"projekt_id" integer,
  	"nazov" varchar,
  	"slug" varchar,
  	"perex" varchar,
  	"datum" timestamp(3) with time zone,
  	"cas" varchar,
  	"termin_text" varchar,
  	"miesto" varchar,
  	"vstupne" varchar,
  	"obrazok_id" integer,
  	"kategoria_id" integer,
  	"popis" jsonb,
  	"odkaz_na_vstupenky" varchar,
  	"odporucana" boolean DEFAULT false,
  	"seo_titulok" varchar,
  	"seo_popis" varchar,
  	"seo_obrazok_id" integer,
  	"seo_neindexovat" boolean DEFAULT false,
  	"vytvoril_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_udalosti_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_udalosti_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_projekt_id" integer,
  	"version_nazov" varchar,
  	"version_slug" varchar,
  	"version_perex" varchar,
  	"version_datum" timestamp(3) with time zone,
  	"version_cas" varchar,
  	"version_termin_text" varchar,
  	"version_miesto" varchar,
  	"version_vstupne" varchar,
  	"version_obrazok_id" integer,
  	"version_kategoria_id" integer,
  	"version_popis" jsonb,
  	"version_odkaz_na_vstupenky" varchar,
  	"version_odporucana" boolean DEFAULT false,
  	"version_seo_titulok" varchar,
  	"version_seo_popis" varchar,
  	"version_seo_obrazok_id" integer,
  	"version_seo_neindexovat" boolean DEFAULT false,
  	"version_vytvoril_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__udalosti_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "kategorie_pre" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_kategorie_pre",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "kategorie" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"projekt_id" integer NOT NULL,
  	"nazov" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"popis" varchar,
  	"poradie" numeric DEFAULT 0,
  	"vytvoril_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"projekt_id" integer NOT NULL,
  	"alt" varchar NOT NULL,
  	"popisok" varchar,
  	"vytvoril_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_nahlad_url" varchar,
  	"sizes_nahlad_width" numeric,
  	"sizes_nahlad_height" numeric,
  	"sizes_nahlad_mime_type" varchar,
  	"sizes_nahlad_filesize" numeric,
  	"sizes_nahlad_filename" varchar,
  	"sizes_karta_url" varchar,
  	"sizes_karta_width" numeric,
  	"sizes_karta_height" numeric,
  	"sizes_karta_mime_type" varchar,
  	"sizes_karta_filesize" numeric,
  	"sizes_karta_filename" varchar,
  	"sizes_mobil_url" varchar,
  	"sizes_mobil_width" numeric,
  	"sizes_mobil_height" numeric,
  	"sizes_mobil_mime_type" varchar,
  	"sizes_mobil_filesize" numeric,
  	"sizes_mobil_filename" varchar
  );
  
  CREATE TABLE "subory" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"projekt_id" integer NOT NULL,
  	"nazov" varchar NOT NULL,
  	"vytvoril_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "navigacia_polozky_podpolozky" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"typ" "enum_navigacia_polozky_podpolozky_typ" DEFAULT 'stranka' NOT NULL,
  	"nova_karta" boolean DEFAULT false,
  	"stranka_id" integer,
  	"adresa" varchar
  );
  
  CREATE TABLE "navigacia_polozky" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"typ" "enum_navigacia_polozky_typ" DEFAULT 'stranka' NOT NULL,
  	"nova_karta" boolean DEFAULT false,
  	"stranka_id" integer,
  	"adresa" varchar
  );
  
  CREATE TABLE "navigacia" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"projekt_id" integer NOT NULL,
  	"nazov" varchar NOT NULL,
  	"umiestnenie" "enum_navigacia_umiestnenie" DEFAULT 'hlavicka' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "nastavenia_webu_hodiny" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"dni" varchar NOT NULL,
  	"cas" varchar NOT NULL
  );
  
  CREATE TABLE "nastavenia_webu_siete" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"siet" "enum_nastavenia_webu_siete_siet" DEFAULT 'instagram' NOT NULL,
  	"adresa" varchar NOT NULL
  );
  
  CREATE TABLE "nastavenia_webu" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"projekt_id" integer NOT NULL,
  	"nazov_webu" varchar NOT NULL,
  	"podtitul" varchar,
  	"popis_webu" varchar,
  	"logo_id" integer,
  	"favicon_id" integer,
  	"obrazok_zdielania_id" integer,
  	"farba_hlavna" varchar,
  	"farba_doplnkova" varchar,
  	"email" varchar,
  	"telefon" varchar,
  	"adresa" varchar,
  	"mapa" varchar,
  	"firemne_udaje_nazov_firmy" varchar,
  	"firemne_udaje_ico" varchar,
  	"firemne_udaje_dic" varchar,
  	"firemne_udaje_sidlo" varchar,
  	"analytics" varchar,
  	"pixel" varchar,
  	"cookie_lista" boolean DEFAULT true,
  	"cookie_text" varchar,
  	"ochrana_udajov" jsonb,
  	"obchodne_podmienky" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "presmerovania" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"projekt_id" integer NOT NULL,
  	"zo" varchar NOT NULL,
  	"na" varchar NOT NULL,
  	"trvale" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "formulare_polia_moznosti" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hodnota" varchar
  );
  
  CREATE TABLE "formulare_polia" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"popis" varchar NOT NULL,
  	"kluc" varchar NOT NULL,
  	"typ" "enum_formulare_polia_typ" DEFAULT 'text' NOT NULL,
  	"povinne" boolean DEFAULT false,
  	"napoveda" varchar
  );
  
  CREATE TABLE "formulare_prijemcovia" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL
  );
  
  CREATE TABLE "formulare" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"projekt_id" integer NOT NULL,
  	"nazov" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"text_tlacidla" varchar DEFAULT 'Odoslať',
  	"sprava_po_odoslani" varchar DEFAULT 'Ďakujeme, ozveme sa čo najskôr.',
  	"presmerovanie" varchar,
  	"predmet" varchar,
  	"potvrdenie_odosielatelovi" boolean DEFAULT false,
  	"text_potvrdenia" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "odpovede" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"projekt_id" integer NOT NULL,
  	"formular_id" integer NOT NULL,
  	"suhrn" varchar,
  	"udaje" jsonb,
  	"stav" "enum_odpovede_stav" DEFAULT 'nove',
  	"zdroj" varchar,
  	"poznamka" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "zaznamy" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"projekt_id" integer NOT NULL,
  	"akcia" "enum_zaznamy_akcia",
  	"kolekcia" varchar,
  	"nazov" varchar,
  	"kto_id" integer,
  	"kto_popis" varchar,
  	"zaznam_id" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "projekty_domeny" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"adresa" varchar NOT NULL
  );
  
  CREATE TABLE "projekty" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nazov" varchar NOT NULL,
  	"stav" "enum_projekty_stav" DEFAULT 'aktivny' NOT NULL,
  	"kod" varchar NOT NULL,
  	"popis" varchar,
  	"domena_hlavna" varchar,
  	"verejne_citanie" boolean DEFAULT true,
  	"revalidate_url" varchar,
  	"revalidate_secret" varchar,
  	"farba" varchar DEFAULT '#2f6f4e',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "users_pristupy" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"projekt_id" integer,
  	"rola" "enum_users_pristupy_rola" DEFAULT 'editor'
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"meno" varchar NOT NULL,
  	"master" boolean DEFAULT false,
  	"aktivny" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "api_klienti" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"projekt_id" integer NOT NULL,
  	"nazov" varchar NOT NULL,
  	"aktivny" boolean DEFAULT true,
  	"poznamka" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"enable_a_p_i_key" boolean,
  	"api_key" varchar,
  	"api_key_index" varchar
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"stranky_id" integer,
  	"prispevky_id" integer,
  	"katalog_id" integer,
  	"udalosti_id" integer,
  	"kategorie_id" integer,
  	"media_id" integer,
  	"subory_id" integer,
  	"navigacia_id" integer,
  	"nastavenia_webu_id" integer,
  	"presmerovania_id" integer,
  	"formulare_id" integer,
  	"odpovede_id" integer,
  	"zaznamy_id" integer,
  	"projekty_id" integer,
  	"users_id" integer,
  	"api_klienti_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"api_klienti_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "stranky_blocks_hero_tlacidla" ADD CONSTRAINT "stranky_blocks_hero_tlacidla_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stranky_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stranky_blocks_hero" ADD CONSTRAINT "stranky_blocks_hero_pozadie_id_media_id_fk" FOREIGN KEY ("pozadie_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stranky_blocks_hero" ADD CONSTRAINT "stranky_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stranky"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stranky_blocks_text" ADD CONSTRAINT "stranky_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stranky"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stranky_blocks_obrazok" ADD CONSTRAINT "stranky_blocks_obrazok_obrazok_id_media_id_fk" FOREIGN KEY ("obrazok_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stranky_blocks_obrazok" ADD CONSTRAINT "stranky_blocks_obrazok_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stranky"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stranky_blocks_galeria" ADD CONSTRAINT "stranky_blocks_galeria_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stranky"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stranky_blocks_vypis" ADD CONSTRAINT "stranky_blocks_vypis_kategoria_id_kategorie_id_fk" FOREIGN KEY ("kategoria_id") REFERENCES "public"."kategorie"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stranky_blocks_vypis" ADD CONSTRAINT "stranky_blocks_vypis_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stranky"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stranky_blocks_dlazdice_polozky" ADD CONSTRAINT "stranky_blocks_dlazdice_polozky_ikona_id_media_id_fk" FOREIGN KEY ("ikona_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stranky_blocks_dlazdice_polozky" ADD CONSTRAINT "stranky_blocks_dlazdice_polozky_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stranky_blocks_dlazdice"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stranky_blocks_dlazdice" ADD CONSTRAINT "stranky_blocks_dlazdice_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stranky"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stranky_blocks_cta_tlacidla" ADD CONSTRAINT "stranky_blocks_cta_tlacidla_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stranky_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stranky_blocks_cta" ADD CONSTRAINT "stranky_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stranky"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stranky_blocks_faq_otazky" ADD CONSTRAINT "stranky_blocks_faq_otazky_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stranky_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stranky_blocks_faq" ADD CONSTRAINT "stranky_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stranky"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stranky_blocks_formular" ADD CONSTRAINT "stranky_blocks_formular_formular_id_formulare_id_fk" FOREIGN KEY ("formular_id") REFERENCES "public"."formulare"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stranky_blocks_formular" ADD CONSTRAINT "stranky_blocks_formular_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stranky"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stranky_blocks_video" ADD CONSTRAINT "stranky_blocks_video_subor_id_subory_id_fk" FOREIGN KEY ("subor_id") REFERENCES "public"."subory"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stranky_blocks_video" ADD CONSTRAINT "stranky_blocks_video_nahlad_id_media_id_fk" FOREIGN KEY ("nahlad_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stranky_blocks_video" ADD CONSTRAINT "stranky_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stranky"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stranky_blocks_kod" ADD CONSTRAINT "stranky_blocks_kod_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stranky"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stranky_blocks_oddelovac" ADD CONSTRAINT "stranky_blocks_oddelovac_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stranky"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stranky" ADD CONSTRAINT "stranky_projekt_id_projekty_id_fk" FOREIGN KEY ("projekt_id") REFERENCES "public"."projekty"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stranky" ADD CONSTRAINT "stranky_seo_obrazok_id_media_id_fk" FOREIGN KEY ("seo_obrazok_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stranky" ADD CONSTRAINT "stranky_vytvoril_id_users_id_fk" FOREIGN KEY ("vytvoril_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stranky_rels" ADD CONSTRAINT "stranky_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."stranky"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stranky_rels" ADD CONSTRAINT "stranky_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stranky_v_blocks_hero_tlacidla" ADD CONSTRAINT "_stranky_v_blocks_hero_tlacidla_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stranky_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stranky_v_blocks_hero" ADD CONSTRAINT "_stranky_v_blocks_hero_pozadie_id_media_id_fk" FOREIGN KEY ("pozadie_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stranky_v_blocks_hero" ADD CONSTRAINT "_stranky_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stranky_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stranky_v_blocks_text" ADD CONSTRAINT "_stranky_v_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stranky_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stranky_v_blocks_obrazok" ADD CONSTRAINT "_stranky_v_blocks_obrazok_obrazok_id_media_id_fk" FOREIGN KEY ("obrazok_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stranky_v_blocks_obrazok" ADD CONSTRAINT "_stranky_v_blocks_obrazok_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stranky_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stranky_v_blocks_galeria" ADD CONSTRAINT "_stranky_v_blocks_galeria_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stranky_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stranky_v_blocks_vypis" ADD CONSTRAINT "_stranky_v_blocks_vypis_kategoria_id_kategorie_id_fk" FOREIGN KEY ("kategoria_id") REFERENCES "public"."kategorie"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stranky_v_blocks_vypis" ADD CONSTRAINT "_stranky_v_blocks_vypis_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stranky_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stranky_v_blocks_dlazdice_polozky" ADD CONSTRAINT "_stranky_v_blocks_dlazdice_polozky_ikona_id_media_id_fk" FOREIGN KEY ("ikona_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stranky_v_blocks_dlazdice_polozky" ADD CONSTRAINT "_stranky_v_blocks_dlazdice_polozky_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stranky_v_blocks_dlazdice"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stranky_v_blocks_dlazdice" ADD CONSTRAINT "_stranky_v_blocks_dlazdice_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stranky_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stranky_v_blocks_cta_tlacidla" ADD CONSTRAINT "_stranky_v_blocks_cta_tlacidla_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stranky_v_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stranky_v_blocks_cta" ADD CONSTRAINT "_stranky_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stranky_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stranky_v_blocks_faq_otazky" ADD CONSTRAINT "_stranky_v_blocks_faq_otazky_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stranky_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stranky_v_blocks_faq" ADD CONSTRAINT "_stranky_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stranky_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stranky_v_blocks_formular" ADD CONSTRAINT "_stranky_v_blocks_formular_formular_id_formulare_id_fk" FOREIGN KEY ("formular_id") REFERENCES "public"."formulare"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stranky_v_blocks_formular" ADD CONSTRAINT "_stranky_v_blocks_formular_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stranky_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stranky_v_blocks_video" ADD CONSTRAINT "_stranky_v_blocks_video_subor_id_subory_id_fk" FOREIGN KEY ("subor_id") REFERENCES "public"."subory"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stranky_v_blocks_video" ADD CONSTRAINT "_stranky_v_blocks_video_nahlad_id_media_id_fk" FOREIGN KEY ("nahlad_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stranky_v_blocks_video" ADD CONSTRAINT "_stranky_v_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stranky_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stranky_v_blocks_kod" ADD CONSTRAINT "_stranky_v_blocks_kod_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stranky_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stranky_v_blocks_oddelovac" ADD CONSTRAINT "_stranky_v_blocks_oddelovac_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stranky_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stranky_v" ADD CONSTRAINT "_stranky_v_parent_id_stranky_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."stranky"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stranky_v" ADD CONSTRAINT "_stranky_v_version_projekt_id_projekty_id_fk" FOREIGN KEY ("version_projekt_id") REFERENCES "public"."projekty"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stranky_v" ADD CONSTRAINT "_stranky_v_version_seo_obrazok_id_media_id_fk" FOREIGN KEY ("version_seo_obrazok_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stranky_v" ADD CONSTRAINT "_stranky_v_version_vytvoril_id_users_id_fk" FOREIGN KEY ("version_vytvoril_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stranky_v_rels" ADD CONSTRAINT "_stranky_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_stranky_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stranky_v_rels" ADD CONSTRAINT "_stranky_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "prispevky_blocks_hero_tlacidla" ADD CONSTRAINT "prispevky_blocks_hero_tlacidla_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."prispevky_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "prispevky_blocks_hero" ADD CONSTRAINT "prispevky_blocks_hero_pozadie_id_media_id_fk" FOREIGN KEY ("pozadie_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "prispevky_blocks_hero" ADD CONSTRAINT "prispevky_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."prispevky"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "prispevky_blocks_text" ADD CONSTRAINT "prispevky_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."prispevky"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "prispevky_blocks_obrazok" ADD CONSTRAINT "prispevky_blocks_obrazok_obrazok_id_media_id_fk" FOREIGN KEY ("obrazok_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "prispevky_blocks_obrazok" ADD CONSTRAINT "prispevky_blocks_obrazok_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."prispevky"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "prispevky_blocks_galeria" ADD CONSTRAINT "prispevky_blocks_galeria_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."prispevky"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "prispevky_blocks_vypis" ADD CONSTRAINT "prispevky_blocks_vypis_kategoria_id_kategorie_id_fk" FOREIGN KEY ("kategoria_id") REFERENCES "public"."kategorie"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "prispevky_blocks_vypis" ADD CONSTRAINT "prispevky_blocks_vypis_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."prispevky"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "prispevky_blocks_dlazdice_polozky" ADD CONSTRAINT "prispevky_blocks_dlazdice_polozky_ikona_id_media_id_fk" FOREIGN KEY ("ikona_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "prispevky_blocks_dlazdice_polozky" ADD CONSTRAINT "prispevky_blocks_dlazdice_polozky_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."prispevky_blocks_dlazdice"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "prispevky_blocks_dlazdice" ADD CONSTRAINT "prispevky_blocks_dlazdice_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."prispevky"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "prispevky_blocks_cta_tlacidla" ADD CONSTRAINT "prispevky_blocks_cta_tlacidla_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."prispevky_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "prispevky_blocks_cta" ADD CONSTRAINT "prispevky_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."prispevky"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "prispevky_blocks_faq_otazky" ADD CONSTRAINT "prispevky_blocks_faq_otazky_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."prispevky_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "prispevky_blocks_faq" ADD CONSTRAINT "prispevky_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."prispevky"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "prispevky_blocks_formular" ADD CONSTRAINT "prispevky_blocks_formular_formular_id_formulare_id_fk" FOREIGN KEY ("formular_id") REFERENCES "public"."formulare"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "prispevky_blocks_formular" ADD CONSTRAINT "prispevky_blocks_formular_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."prispevky"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "prispevky_blocks_video" ADD CONSTRAINT "prispevky_blocks_video_subor_id_subory_id_fk" FOREIGN KEY ("subor_id") REFERENCES "public"."subory"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "prispevky_blocks_video" ADD CONSTRAINT "prispevky_blocks_video_nahlad_id_media_id_fk" FOREIGN KEY ("nahlad_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "prispevky_blocks_video" ADD CONSTRAINT "prispevky_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."prispevky"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "prispevky_blocks_kod" ADD CONSTRAINT "prispevky_blocks_kod_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."prispevky"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "prispevky_blocks_oddelovac" ADD CONSTRAINT "prispevky_blocks_oddelovac_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."prispevky"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "prispevky" ADD CONSTRAINT "prispevky_projekt_id_projekty_id_fk" FOREIGN KEY ("projekt_id") REFERENCES "public"."projekty"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "prispevky" ADD CONSTRAINT "prispevky_obrazok_id_media_id_fk" FOREIGN KEY ("obrazok_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "prispevky" ADD CONSTRAINT "prispevky_seo_obrazok_id_media_id_fk" FOREIGN KEY ("seo_obrazok_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "prispevky" ADD CONSTRAINT "prispevky_vytvoril_id_users_id_fk" FOREIGN KEY ("vytvoril_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "prispevky_rels" ADD CONSTRAINT "prispevky_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."prispevky"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "prispevky_rels" ADD CONSTRAINT "prispevky_rels_kategorie_fk" FOREIGN KEY ("kategorie_id") REFERENCES "public"."kategorie"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "prispevky_rels" ADD CONSTRAINT "prispevky_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_prispevky_v_blocks_hero_tlacidla" ADD CONSTRAINT "_prispevky_v_blocks_hero_tlacidla_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_prispevky_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_prispevky_v_blocks_hero" ADD CONSTRAINT "_prispevky_v_blocks_hero_pozadie_id_media_id_fk" FOREIGN KEY ("pozadie_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_prispevky_v_blocks_hero" ADD CONSTRAINT "_prispevky_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_prispevky_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_prispevky_v_blocks_text" ADD CONSTRAINT "_prispevky_v_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_prispevky_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_prispevky_v_blocks_obrazok" ADD CONSTRAINT "_prispevky_v_blocks_obrazok_obrazok_id_media_id_fk" FOREIGN KEY ("obrazok_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_prispevky_v_blocks_obrazok" ADD CONSTRAINT "_prispevky_v_blocks_obrazok_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_prispevky_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_prispevky_v_blocks_galeria" ADD CONSTRAINT "_prispevky_v_blocks_galeria_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_prispevky_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_prispevky_v_blocks_vypis" ADD CONSTRAINT "_prispevky_v_blocks_vypis_kategoria_id_kategorie_id_fk" FOREIGN KEY ("kategoria_id") REFERENCES "public"."kategorie"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_prispevky_v_blocks_vypis" ADD CONSTRAINT "_prispevky_v_blocks_vypis_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_prispevky_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_prispevky_v_blocks_dlazdice_polozky" ADD CONSTRAINT "_prispevky_v_blocks_dlazdice_polozky_ikona_id_media_id_fk" FOREIGN KEY ("ikona_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_prispevky_v_blocks_dlazdice_polozky" ADD CONSTRAINT "_prispevky_v_blocks_dlazdice_polozky_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_prispevky_v_blocks_dlazdice"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_prispevky_v_blocks_dlazdice" ADD CONSTRAINT "_prispevky_v_blocks_dlazdice_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_prispevky_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_prispevky_v_blocks_cta_tlacidla" ADD CONSTRAINT "_prispevky_v_blocks_cta_tlacidla_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_prispevky_v_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_prispevky_v_blocks_cta" ADD CONSTRAINT "_prispevky_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_prispevky_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_prispevky_v_blocks_faq_otazky" ADD CONSTRAINT "_prispevky_v_blocks_faq_otazky_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_prispevky_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_prispevky_v_blocks_faq" ADD CONSTRAINT "_prispevky_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_prispevky_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_prispevky_v_blocks_formular" ADD CONSTRAINT "_prispevky_v_blocks_formular_formular_id_formulare_id_fk" FOREIGN KEY ("formular_id") REFERENCES "public"."formulare"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_prispevky_v_blocks_formular" ADD CONSTRAINT "_prispevky_v_blocks_formular_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_prispevky_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_prispevky_v_blocks_video" ADD CONSTRAINT "_prispevky_v_blocks_video_subor_id_subory_id_fk" FOREIGN KEY ("subor_id") REFERENCES "public"."subory"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_prispevky_v_blocks_video" ADD CONSTRAINT "_prispevky_v_blocks_video_nahlad_id_media_id_fk" FOREIGN KEY ("nahlad_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_prispevky_v_blocks_video" ADD CONSTRAINT "_prispevky_v_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_prispevky_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_prispevky_v_blocks_kod" ADD CONSTRAINT "_prispevky_v_blocks_kod_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_prispevky_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_prispevky_v_blocks_oddelovac" ADD CONSTRAINT "_prispevky_v_blocks_oddelovac_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_prispevky_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_prispevky_v" ADD CONSTRAINT "_prispevky_v_parent_id_prispevky_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."prispevky"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_prispevky_v" ADD CONSTRAINT "_prispevky_v_version_projekt_id_projekty_id_fk" FOREIGN KEY ("version_projekt_id") REFERENCES "public"."projekty"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_prispevky_v" ADD CONSTRAINT "_prispevky_v_version_obrazok_id_media_id_fk" FOREIGN KEY ("version_obrazok_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_prispevky_v" ADD CONSTRAINT "_prispevky_v_version_seo_obrazok_id_media_id_fk" FOREIGN KEY ("version_seo_obrazok_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_prispevky_v" ADD CONSTRAINT "_prispevky_v_version_vytvoril_id_users_id_fk" FOREIGN KEY ("version_vytvoril_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_prispevky_v_rels" ADD CONSTRAINT "_prispevky_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_prispevky_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_prispevky_v_rels" ADD CONSTRAINT "_prispevky_v_rels_kategorie_fk" FOREIGN KEY ("kategorie_id") REFERENCES "public"."kategorie"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_prispevky_v_rels" ADD CONSTRAINT "_prispevky_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "katalog_vlastnosti" ADD CONSTRAINT "katalog_vlastnosti_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."katalog"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "katalog" ADD CONSTRAINT "katalog_projekt_id_projekty_id_fk" FOREIGN KEY ("projekt_id") REFERENCES "public"."projekty"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "katalog" ADD CONSTRAINT "katalog_kategoria_id_kategorie_id_fk" FOREIGN KEY ("kategoria_id") REFERENCES "public"."kategorie"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "katalog" ADD CONSTRAINT "katalog_obrazok_id_media_id_fk" FOREIGN KEY ("obrazok_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "katalog" ADD CONSTRAINT "katalog_seo_obrazok_id_media_id_fk" FOREIGN KEY ("seo_obrazok_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "katalog" ADD CONSTRAINT "katalog_vytvoril_id_users_id_fk" FOREIGN KEY ("vytvoril_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "katalog_rels" ADD CONSTRAINT "katalog_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."katalog"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "katalog_rels" ADD CONSTRAINT "katalog_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_katalog_v_version_vlastnosti" ADD CONSTRAINT "_katalog_v_version_vlastnosti_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_katalog_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_katalog_v" ADD CONSTRAINT "_katalog_v_parent_id_katalog_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."katalog"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_katalog_v" ADD CONSTRAINT "_katalog_v_version_projekt_id_projekty_id_fk" FOREIGN KEY ("version_projekt_id") REFERENCES "public"."projekty"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_katalog_v" ADD CONSTRAINT "_katalog_v_version_kategoria_id_kategorie_id_fk" FOREIGN KEY ("version_kategoria_id") REFERENCES "public"."kategorie"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_katalog_v" ADD CONSTRAINT "_katalog_v_version_obrazok_id_media_id_fk" FOREIGN KEY ("version_obrazok_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_katalog_v" ADD CONSTRAINT "_katalog_v_version_seo_obrazok_id_media_id_fk" FOREIGN KEY ("version_seo_obrazok_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_katalog_v" ADD CONSTRAINT "_katalog_v_version_vytvoril_id_users_id_fk" FOREIGN KEY ("version_vytvoril_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_katalog_v_rels" ADD CONSTRAINT "_katalog_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_katalog_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_katalog_v_rels" ADD CONSTRAINT "_katalog_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "udalosti" ADD CONSTRAINT "udalosti_projekt_id_projekty_id_fk" FOREIGN KEY ("projekt_id") REFERENCES "public"."projekty"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "udalosti" ADD CONSTRAINT "udalosti_obrazok_id_media_id_fk" FOREIGN KEY ("obrazok_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "udalosti" ADD CONSTRAINT "udalosti_kategoria_id_kategorie_id_fk" FOREIGN KEY ("kategoria_id") REFERENCES "public"."kategorie"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "udalosti" ADD CONSTRAINT "udalosti_seo_obrazok_id_media_id_fk" FOREIGN KEY ("seo_obrazok_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "udalosti" ADD CONSTRAINT "udalosti_vytvoril_id_users_id_fk" FOREIGN KEY ("vytvoril_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_udalosti_v" ADD CONSTRAINT "_udalosti_v_parent_id_udalosti_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."udalosti"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_udalosti_v" ADD CONSTRAINT "_udalosti_v_version_projekt_id_projekty_id_fk" FOREIGN KEY ("version_projekt_id") REFERENCES "public"."projekty"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_udalosti_v" ADD CONSTRAINT "_udalosti_v_version_obrazok_id_media_id_fk" FOREIGN KEY ("version_obrazok_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_udalosti_v" ADD CONSTRAINT "_udalosti_v_version_kategoria_id_kategorie_id_fk" FOREIGN KEY ("version_kategoria_id") REFERENCES "public"."kategorie"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_udalosti_v" ADD CONSTRAINT "_udalosti_v_version_seo_obrazok_id_media_id_fk" FOREIGN KEY ("version_seo_obrazok_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_udalosti_v" ADD CONSTRAINT "_udalosti_v_version_vytvoril_id_users_id_fk" FOREIGN KEY ("version_vytvoril_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "kategorie_pre" ADD CONSTRAINT "kategorie_pre_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."kategorie"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "kategorie" ADD CONSTRAINT "kategorie_projekt_id_projekty_id_fk" FOREIGN KEY ("projekt_id") REFERENCES "public"."projekty"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "kategorie" ADD CONSTRAINT "kategorie_vytvoril_id_users_id_fk" FOREIGN KEY ("vytvoril_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media_projekt_id_projekty_id_fk" FOREIGN KEY ("projekt_id") REFERENCES "public"."projekty"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media_vytvoril_id_users_id_fk" FOREIGN KEY ("vytvoril_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "subory" ADD CONSTRAINT "subory_projekt_id_projekty_id_fk" FOREIGN KEY ("projekt_id") REFERENCES "public"."projekty"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "subory" ADD CONSTRAINT "subory_vytvoril_id_users_id_fk" FOREIGN KEY ("vytvoril_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navigacia_polozky_podpolozky" ADD CONSTRAINT "navigacia_polozky_podpolozky_stranka_id_stranky_id_fk" FOREIGN KEY ("stranka_id") REFERENCES "public"."stranky"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navigacia_polozky_podpolozky" ADD CONSTRAINT "navigacia_polozky_podpolozky_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigacia_polozky"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigacia_polozky" ADD CONSTRAINT "navigacia_polozky_stranka_id_stranky_id_fk" FOREIGN KEY ("stranka_id") REFERENCES "public"."stranky"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navigacia_polozky" ADD CONSTRAINT "navigacia_polozky_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigacia"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigacia" ADD CONSTRAINT "navigacia_projekt_id_projekty_id_fk" FOREIGN KEY ("projekt_id") REFERENCES "public"."projekty"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "nastavenia_webu_hodiny" ADD CONSTRAINT "nastavenia_webu_hodiny_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."nastavenia_webu"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "nastavenia_webu_siete" ADD CONSTRAINT "nastavenia_webu_siete_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."nastavenia_webu"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "nastavenia_webu" ADD CONSTRAINT "nastavenia_webu_projekt_id_projekty_id_fk" FOREIGN KEY ("projekt_id") REFERENCES "public"."projekty"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "nastavenia_webu" ADD CONSTRAINT "nastavenia_webu_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "nastavenia_webu" ADD CONSTRAINT "nastavenia_webu_favicon_id_media_id_fk" FOREIGN KEY ("favicon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "nastavenia_webu" ADD CONSTRAINT "nastavenia_webu_obrazok_zdielania_id_media_id_fk" FOREIGN KEY ("obrazok_zdielania_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "presmerovania" ADD CONSTRAINT "presmerovania_projekt_id_projekty_id_fk" FOREIGN KEY ("projekt_id") REFERENCES "public"."projekty"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "formulare_polia_moznosti" ADD CONSTRAINT "formulare_polia_moznosti_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."formulare_polia"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "formulare_polia" ADD CONSTRAINT "formulare_polia_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."formulare"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "formulare_prijemcovia" ADD CONSTRAINT "formulare_prijemcovia_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."formulare"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "formulare" ADD CONSTRAINT "formulare_projekt_id_projekty_id_fk" FOREIGN KEY ("projekt_id") REFERENCES "public"."projekty"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "odpovede" ADD CONSTRAINT "odpovede_projekt_id_projekty_id_fk" FOREIGN KEY ("projekt_id") REFERENCES "public"."projekty"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "odpovede" ADD CONSTRAINT "odpovede_formular_id_formulare_id_fk" FOREIGN KEY ("formular_id") REFERENCES "public"."formulare"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "zaznamy" ADD CONSTRAINT "zaznamy_projekt_id_projekty_id_fk" FOREIGN KEY ("projekt_id") REFERENCES "public"."projekty"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "zaznamy" ADD CONSTRAINT "zaznamy_kto_id_users_id_fk" FOREIGN KEY ("kto_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projekty_domeny" ADD CONSTRAINT "projekty_domeny_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projekty"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_pristupy" ADD CONSTRAINT "users_pristupy_projekt_id_projekty_id_fk" FOREIGN KEY ("projekt_id") REFERENCES "public"."projekty"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_pristupy" ADD CONSTRAINT "users_pristupy_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "api_klienti" ADD CONSTRAINT "api_klienti_projekt_id_projekty_id_fk" FOREIGN KEY ("projekt_id") REFERENCES "public"."projekty"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_stranky_fk" FOREIGN KEY ("stranky_id") REFERENCES "public"."stranky"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_prispevky_fk" FOREIGN KEY ("prispevky_id") REFERENCES "public"."prispevky"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_katalog_fk" FOREIGN KEY ("katalog_id") REFERENCES "public"."katalog"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_udalosti_fk" FOREIGN KEY ("udalosti_id") REFERENCES "public"."udalosti"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_kategorie_fk" FOREIGN KEY ("kategorie_id") REFERENCES "public"."kategorie"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_subory_fk" FOREIGN KEY ("subory_id") REFERENCES "public"."subory"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_navigacia_fk" FOREIGN KEY ("navigacia_id") REFERENCES "public"."navigacia"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_nastavenia_webu_fk" FOREIGN KEY ("nastavenia_webu_id") REFERENCES "public"."nastavenia_webu"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_presmerovania_fk" FOREIGN KEY ("presmerovania_id") REFERENCES "public"."presmerovania"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_formulare_fk" FOREIGN KEY ("formulare_id") REFERENCES "public"."formulare"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_odpovede_fk" FOREIGN KEY ("odpovede_id") REFERENCES "public"."odpovede"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_zaznamy_fk" FOREIGN KEY ("zaznamy_id") REFERENCES "public"."zaznamy"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projekty_fk" FOREIGN KEY ("projekty_id") REFERENCES "public"."projekty"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_api_klienti_fk" FOREIGN KEY ("api_klienti_id") REFERENCES "public"."api_klienti"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_api_klienti_fk" FOREIGN KEY ("api_klienti_id") REFERENCES "public"."api_klienti"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "stranky_blocks_hero_tlacidla_order_idx" ON "stranky_blocks_hero_tlacidla" USING btree ("_order");
  CREATE INDEX "stranky_blocks_hero_tlacidla_parent_id_idx" ON "stranky_blocks_hero_tlacidla" USING btree ("_parent_id");
  CREATE INDEX "stranky_blocks_hero_order_idx" ON "stranky_blocks_hero" USING btree ("_order");
  CREATE INDEX "stranky_blocks_hero_parent_id_idx" ON "stranky_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "stranky_blocks_hero_path_idx" ON "stranky_blocks_hero" USING btree ("_path");
  CREATE INDEX "stranky_blocks_hero_pozadie_idx" ON "stranky_blocks_hero" USING btree ("pozadie_id");
  CREATE INDEX "stranky_blocks_text_order_idx" ON "stranky_blocks_text" USING btree ("_order");
  CREATE INDEX "stranky_blocks_text_parent_id_idx" ON "stranky_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "stranky_blocks_text_path_idx" ON "stranky_blocks_text" USING btree ("_path");
  CREATE INDEX "stranky_blocks_obrazok_order_idx" ON "stranky_blocks_obrazok" USING btree ("_order");
  CREATE INDEX "stranky_blocks_obrazok_parent_id_idx" ON "stranky_blocks_obrazok" USING btree ("_parent_id");
  CREATE INDEX "stranky_blocks_obrazok_path_idx" ON "stranky_blocks_obrazok" USING btree ("_path");
  CREATE INDEX "stranky_blocks_obrazok_obrazok_idx" ON "stranky_blocks_obrazok" USING btree ("obrazok_id");
  CREATE INDEX "stranky_blocks_galeria_order_idx" ON "stranky_blocks_galeria" USING btree ("_order");
  CREATE INDEX "stranky_blocks_galeria_parent_id_idx" ON "stranky_blocks_galeria" USING btree ("_parent_id");
  CREATE INDEX "stranky_blocks_galeria_path_idx" ON "stranky_blocks_galeria" USING btree ("_path");
  CREATE INDEX "stranky_blocks_vypis_order_idx" ON "stranky_blocks_vypis" USING btree ("_order");
  CREATE INDEX "stranky_blocks_vypis_parent_id_idx" ON "stranky_blocks_vypis" USING btree ("_parent_id");
  CREATE INDEX "stranky_blocks_vypis_path_idx" ON "stranky_blocks_vypis" USING btree ("_path");
  CREATE INDEX "stranky_blocks_vypis_kategoria_idx" ON "stranky_blocks_vypis" USING btree ("kategoria_id");
  CREATE INDEX "stranky_blocks_dlazdice_polozky_order_idx" ON "stranky_blocks_dlazdice_polozky" USING btree ("_order");
  CREATE INDEX "stranky_blocks_dlazdice_polozky_parent_id_idx" ON "stranky_blocks_dlazdice_polozky" USING btree ("_parent_id");
  CREATE INDEX "stranky_blocks_dlazdice_polozky_ikona_idx" ON "stranky_blocks_dlazdice_polozky" USING btree ("ikona_id");
  CREATE INDEX "stranky_blocks_dlazdice_order_idx" ON "stranky_blocks_dlazdice" USING btree ("_order");
  CREATE INDEX "stranky_blocks_dlazdice_parent_id_idx" ON "stranky_blocks_dlazdice" USING btree ("_parent_id");
  CREATE INDEX "stranky_blocks_dlazdice_path_idx" ON "stranky_blocks_dlazdice" USING btree ("_path");
  CREATE INDEX "stranky_blocks_cta_tlacidla_order_idx" ON "stranky_blocks_cta_tlacidla" USING btree ("_order");
  CREATE INDEX "stranky_blocks_cta_tlacidla_parent_id_idx" ON "stranky_blocks_cta_tlacidla" USING btree ("_parent_id");
  CREATE INDEX "stranky_blocks_cta_order_idx" ON "stranky_blocks_cta" USING btree ("_order");
  CREATE INDEX "stranky_blocks_cta_parent_id_idx" ON "stranky_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "stranky_blocks_cta_path_idx" ON "stranky_blocks_cta" USING btree ("_path");
  CREATE INDEX "stranky_blocks_faq_otazky_order_idx" ON "stranky_blocks_faq_otazky" USING btree ("_order");
  CREATE INDEX "stranky_blocks_faq_otazky_parent_id_idx" ON "stranky_blocks_faq_otazky" USING btree ("_parent_id");
  CREATE INDEX "stranky_blocks_faq_order_idx" ON "stranky_blocks_faq" USING btree ("_order");
  CREATE INDEX "stranky_blocks_faq_parent_id_idx" ON "stranky_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "stranky_blocks_faq_path_idx" ON "stranky_blocks_faq" USING btree ("_path");
  CREATE INDEX "stranky_blocks_formular_order_idx" ON "stranky_blocks_formular" USING btree ("_order");
  CREATE INDEX "stranky_blocks_formular_parent_id_idx" ON "stranky_blocks_formular" USING btree ("_parent_id");
  CREATE INDEX "stranky_blocks_formular_path_idx" ON "stranky_blocks_formular" USING btree ("_path");
  CREATE INDEX "stranky_blocks_formular_formular_idx" ON "stranky_blocks_formular" USING btree ("formular_id");
  CREATE INDEX "stranky_blocks_video_order_idx" ON "stranky_blocks_video" USING btree ("_order");
  CREATE INDEX "stranky_blocks_video_parent_id_idx" ON "stranky_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "stranky_blocks_video_path_idx" ON "stranky_blocks_video" USING btree ("_path");
  CREATE INDEX "stranky_blocks_video_subor_idx" ON "stranky_blocks_video" USING btree ("subor_id");
  CREATE INDEX "stranky_blocks_video_nahlad_idx" ON "stranky_blocks_video" USING btree ("nahlad_id");
  CREATE INDEX "stranky_blocks_kod_order_idx" ON "stranky_blocks_kod" USING btree ("_order");
  CREATE INDEX "stranky_blocks_kod_parent_id_idx" ON "stranky_blocks_kod" USING btree ("_parent_id");
  CREATE INDEX "stranky_blocks_kod_path_idx" ON "stranky_blocks_kod" USING btree ("_path");
  CREATE INDEX "stranky_blocks_oddelovac_order_idx" ON "stranky_blocks_oddelovac" USING btree ("_order");
  CREATE INDEX "stranky_blocks_oddelovac_parent_id_idx" ON "stranky_blocks_oddelovac" USING btree ("_parent_id");
  CREATE INDEX "stranky_blocks_oddelovac_path_idx" ON "stranky_blocks_oddelovac" USING btree ("_path");
  CREATE INDEX "stranky_projekt_idx" ON "stranky" USING btree ("projekt_id");
  CREATE INDEX "stranky_cesta_idx" ON "stranky" USING btree ("cesta");
  CREATE INDEX "stranky_seo_seo_obrazok_idx" ON "stranky" USING btree ("seo_obrazok_id");
  CREATE INDEX "stranky_vytvoril_idx" ON "stranky" USING btree ("vytvoril_id");
  CREATE INDEX "stranky_updated_at_idx" ON "stranky" USING btree ("updated_at");
  CREATE INDEX "stranky_created_at_idx" ON "stranky" USING btree ("created_at");
  CREATE INDEX "stranky__status_idx" ON "stranky" USING btree ("_status");
  CREATE UNIQUE INDEX "projekt_cesta_idx" ON "stranky" USING btree ("projekt_id","cesta");
  CREATE INDEX "stranky_rels_order_idx" ON "stranky_rels" USING btree ("order");
  CREATE INDEX "stranky_rels_parent_idx" ON "stranky_rels" USING btree ("parent_id");
  CREATE INDEX "stranky_rels_path_idx" ON "stranky_rels" USING btree ("path");
  CREATE INDEX "stranky_rels_media_id_idx" ON "stranky_rels" USING btree ("media_id");
  CREATE INDEX "_stranky_v_blocks_hero_tlacidla_order_idx" ON "_stranky_v_blocks_hero_tlacidla" USING btree ("_order");
  CREATE INDEX "_stranky_v_blocks_hero_tlacidla_parent_id_idx" ON "_stranky_v_blocks_hero_tlacidla" USING btree ("_parent_id");
  CREATE INDEX "_stranky_v_blocks_hero_order_idx" ON "_stranky_v_blocks_hero" USING btree ("_order");
  CREATE INDEX "_stranky_v_blocks_hero_parent_id_idx" ON "_stranky_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "_stranky_v_blocks_hero_path_idx" ON "_stranky_v_blocks_hero" USING btree ("_path");
  CREATE INDEX "_stranky_v_blocks_hero_pozadie_idx" ON "_stranky_v_blocks_hero" USING btree ("pozadie_id");
  CREATE INDEX "_stranky_v_blocks_text_order_idx" ON "_stranky_v_blocks_text" USING btree ("_order");
  CREATE INDEX "_stranky_v_blocks_text_parent_id_idx" ON "_stranky_v_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "_stranky_v_blocks_text_path_idx" ON "_stranky_v_blocks_text" USING btree ("_path");
  CREATE INDEX "_stranky_v_blocks_obrazok_order_idx" ON "_stranky_v_blocks_obrazok" USING btree ("_order");
  CREATE INDEX "_stranky_v_blocks_obrazok_parent_id_idx" ON "_stranky_v_blocks_obrazok" USING btree ("_parent_id");
  CREATE INDEX "_stranky_v_blocks_obrazok_path_idx" ON "_stranky_v_blocks_obrazok" USING btree ("_path");
  CREATE INDEX "_stranky_v_blocks_obrazok_obrazok_idx" ON "_stranky_v_blocks_obrazok" USING btree ("obrazok_id");
  CREATE INDEX "_stranky_v_blocks_galeria_order_idx" ON "_stranky_v_blocks_galeria" USING btree ("_order");
  CREATE INDEX "_stranky_v_blocks_galeria_parent_id_idx" ON "_stranky_v_blocks_galeria" USING btree ("_parent_id");
  CREATE INDEX "_stranky_v_blocks_galeria_path_idx" ON "_stranky_v_blocks_galeria" USING btree ("_path");
  CREATE INDEX "_stranky_v_blocks_vypis_order_idx" ON "_stranky_v_blocks_vypis" USING btree ("_order");
  CREATE INDEX "_stranky_v_blocks_vypis_parent_id_idx" ON "_stranky_v_blocks_vypis" USING btree ("_parent_id");
  CREATE INDEX "_stranky_v_blocks_vypis_path_idx" ON "_stranky_v_blocks_vypis" USING btree ("_path");
  CREATE INDEX "_stranky_v_blocks_vypis_kategoria_idx" ON "_stranky_v_blocks_vypis" USING btree ("kategoria_id");
  CREATE INDEX "_stranky_v_blocks_dlazdice_polozky_order_idx" ON "_stranky_v_blocks_dlazdice_polozky" USING btree ("_order");
  CREATE INDEX "_stranky_v_blocks_dlazdice_polozky_parent_id_idx" ON "_stranky_v_blocks_dlazdice_polozky" USING btree ("_parent_id");
  CREATE INDEX "_stranky_v_blocks_dlazdice_polozky_ikona_idx" ON "_stranky_v_blocks_dlazdice_polozky" USING btree ("ikona_id");
  CREATE INDEX "_stranky_v_blocks_dlazdice_order_idx" ON "_stranky_v_blocks_dlazdice" USING btree ("_order");
  CREATE INDEX "_stranky_v_blocks_dlazdice_parent_id_idx" ON "_stranky_v_blocks_dlazdice" USING btree ("_parent_id");
  CREATE INDEX "_stranky_v_blocks_dlazdice_path_idx" ON "_stranky_v_blocks_dlazdice" USING btree ("_path");
  CREATE INDEX "_stranky_v_blocks_cta_tlacidla_order_idx" ON "_stranky_v_blocks_cta_tlacidla" USING btree ("_order");
  CREATE INDEX "_stranky_v_blocks_cta_tlacidla_parent_id_idx" ON "_stranky_v_blocks_cta_tlacidla" USING btree ("_parent_id");
  CREATE INDEX "_stranky_v_blocks_cta_order_idx" ON "_stranky_v_blocks_cta" USING btree ("_order");
  CREATE INDEX "_stranky_v_blocks_cta_parent_id_idx" ON "_stranky_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "_stranky_v_blocks_cta_path_idx" ON "_stranky_v_blocks_cta" USING btree ("_path");
  CREATE INDEX "_stranky_v_blocks_faq_otazky_order_idx" ON "_stranky_v_blocks_faq_otazky" USING btree ("_order");
  CREATE INDEX "_stranky_v_blocks_faq_otazky_parent_id_idx" ON "_stranky_v_blocks_faq_otazky" USING btree ("_parent_id");
  CREATE INDEX "_stranky_v_blocks_faq_order_idx" ON "_stranky_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_stranky_v_blocks_faq_parent_id_idx" ON "_stranky_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_stranky_v_blocks_faq_path_idx" ON "_stranky_v_blocks_faq" USING btree ("_path");
  CREATE INDEX "_stranky_v_blocks_formular_order_idx" ON "_stranky_v_blocks_formular" USING btree ("_order");
  CREATE INDEX "_stranky_v_blocks_formular_parent_id_idx" ON "_stranky_v_blocks_formular" USING btree ("_parent_id");
  CREATE INDEX "_stranky_v_blocks_formular_path_idx" ON "_stranky_v_blocks_formular" USING btree ("_path");
  CREATE INDEX "_stranky_v_blocks_formular_formular_idx" ON "_stranky_v_blocks_formular" USING btree ("formular_id");
  CREATE INDEX "_stranky_v_blocks_video_order_idx" ON "_stranky_v_blocks_video" USING btree ("_order");
  CREATE INDEX "_stranky_v_blocks_video_parent_id_idx" ON "_stranky_v_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "_stranky_v_blocks_video_path_idx" ON "_stranky_v_blocks_video" USING btree ("_path");
  CREATE INDEX "_stranky_v_blocks_video_subor_idx" ON "_stranky_v_blocks_video" USING btree ("subor_id");
  CREATE INDEX "_stranky_v_blocks_video_nahlad_idx" ON "_stranky_v_blocks_video" USING btree ("nahlad_id");
  CREATE INDEX "_stranky_v_blocks_kod_order_idx" ON "_stranky_v_blocks_kod" USING btree ("_order");
  CREATE INDEX "_stranky_v_blocks_kod_parent_id_idx" ON "_stranky_v_blocks_kod" USING btree ("_parent_id");
  CREATE INDEX "_stranky_v_blocks_kod_path_idx" ON "_stranky_v_blocks_kod" USING btree ("_path");
  CREATE INDEX "_stranky_v_blocks_oddelovac_order_idx" ON "_stranky_v_blocks_oddelovac" USING btree ("_order");
  CREATE INDEX "_stranky_v_blocks_oddelovac_parent_id_idx" ON "_stranky_v_blocks_oddelovac" USING btree ("_parent_id");
  CREATE INDEX "_stranky_v_blocks_oddelovac_path_idx" ON "_stranky_v_blocks_oddelovac" USING btree ("_path");
  CREATE INDEX "_stranky_v_parent_idx" ON "_stranky_v" USING btree ("parent_id");
  CREATE INDEX "_stranky_v_version_version_projekt_idx" ON "_stranky_v" USING btree ("version_projekt_id");
  CREATE INDEX "_stranky_v_version_version_cesta_idx" ON "_stranky_v" USING btree ("version_cesta");
  CREATE INDEX "_stranky_v_version_seo_version_seo_obrazok_idx" ON "_stranky_v" USING btree ("version_seo_obrazok_id");
  CREATE INDEX "_stranky_v_version_version_vytvoril_idx" ON "_stranky_v" USING btree ("version_vytvoril_id");
  CREATE INDEX "_stranky_v_version_version_updated_at_idx" ON "_stranky_v" USING btree ("version_updated_at");
  CREATE INDEX "_stranky_v_version_version_created_at_idx" ON "_stranky_v" USING btree ("version_created_at");
  CREATE INDEX "_stranky_v_version_version__status_idx" ON "_stranky_v" USING btree ("version__status");
  CREATE INDEX "_stranky_v_created_at_idx" ON "_stranky_v" USING btree ("created_at");
  CREATE INDEX "_stranky_v_updated_at_idx" ON "_stranky_v" USING btree ("updated_at");
  CREATE INDEX "_stranky_v_latest_idx" ON "_stranky_v" USING btree ("latest");
  CREATE INDEX "_stranky_v_autosave_idx" ON "_stranky_v" USING btree ("autosave");
  CREATE INDEX "version_projekt_version_cesta_idx" ON "_stranky_v" USING btree ("version_projekt_id","version_cesta");
  CREATE INDEX "_stranky_v_rels_order_idx" ON "_stranky_v_rels" USING btree ("order");
  CREATE INDEX "_stranky_v_rels_parent_idx" ON "_stranky_v_rels" USING btree ("parent_id");
  CREATE INDEX "_stranky_v_rels_path_idx" ON "_stranky_v_rels" USING btree ("path");
  CREATE INDEX "_stranky_v_rels_media_id_idx" ON "_stranky_v_rels" USING btree ("media_id");
  CREATE INDEX "prispevky_blocks_hero_tlacidla_order_idx" ON "prispevky_blocks_hero_tlacidla" USING btree ("_order");
  CREATE INDEX "prispevky_blocks_hero_tlacidla_parent_id_idx" ON "prispevky_blocks_hero_tlacidla" USING btree ("_parent_id");
  CREATE INDEX "prispevky_blocks_hero_order_idx" ON "prispevky_blocks_hero" USING btree ("_order");
  CREATE INDEX "prispevky_blocks_hero_parent_id_idx" ON "prispevky_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "prispevky_blocks_hero_path_idx" ON "prispevky_blocks_hero" USING btree ("_path");
  CREATE INDEX "prispevky_blocks_hero_pozadie_idx" ON "prispevky_blocks_hero" USING btree ("pozadie_id");
  CREATE INDEX "prispevky_blocks_text_order_idx" ON "prispevky_blocks_text" USING btree ("_order");
  CREATE INDEX "prispevky_blocks_text_parent_id_idx" ON "prispevky_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "prispevky_blocks_text_path_idx" ON "prispevky_blocks_text" USING btree ("_path");
  CREATE INDEX "prispevky_blocks_obrazok_order_idx" ON "prispevky_blocks_obrazok" USING btree ("_order");
  CREATE INDEX "prispevky_blocks_obrazok_parent_id_idx" ON "prispevky_blocks_obrazok" USING btree ("_parent_id");
  CREATE INDEX "prispevky_blocks_obrazok_path_idx" ON "prispevky_blocks_obrazok" USING btree ("_path");
  CREATE INDEX "prispevky_blocks_obrazok_obrazok_idx" ON "prispevky_blocks_obrazok" USING btree ("obrazok_id");
  CREATE INDEX "prispevky_blocks_galeria_order_idx" ON "prispevky_blocks_galeria" USING btree ("_order");
  CREATE INDEX "prispevky_blocks_galeria_parent_id_idx" ON "prispevky_blocks_galeria" USING btree ("_parent_id");
  CREATE INDEX "prispevky_blocks_galeria_path_idx" ON "prispevky_blocks_galeria" USING btree ("_path");
  CREATE INDEX "prispevky_blocks_vypis_order_idx" ON "prispevky_blocks_vypis" USING btree ("_order");
  CREATE INDEX "prispevky_blocks_vypis_parent_id_idx" ON "prispevky_blocks_vypis" USING btree ("_parent_id");
  CREATE INDEX "prispevky_blocks_vypis_path_idx" ON "prispevky_blocks_vypis" USING btree ("_path");
  CREATE INDEX "prispevky_blocks_vypis_kategoria_idx" ON "prispevky_blocks_vypis" USING btree ("kategoria_id");
  CREATE INDEX "prispevky_blocks_dlazdice_polozky_order_idx" ON "prispevky_blocks_dlazdice_polozky" USING btree ("_order");
  CREATE INDEX "prispevky_blocks_dlazdice_polozky_parent_id_idx" ON "prispevky_blocks_dlazdice_polozky" USING btree ("_parent_id");
  CREATE INDEX "prispevky_blocks_dlazdice_polozky_ikona_idx" ON "prispevky_blocks_dlazdice_polozky" USING btree ("ikona_id");
  CREATE INDEX "prispevky_blocks_dlazdice_order_idx" ON "prispevky_blocks_dlazdice" USING btree ("_order");
  CREATE INDEX "prispevky_blocks_dlazdice_parent_id_idx" ON "prispevky_blocks_dlazdice" USING btree ("_parent_id");
  CREATE INDEX "prispevky_blocks_dlazdice_path_idx" ON "prispevky_blocks_dlazdice" USING btree ("_path");
  CREATE INDEX "prispevky_blocks_cta_tlacidla_order_idx" ON "prispevky_blocks_cta_tlacidla" USING btree ("_order");
  CREATE INDEX "prispevky_blocks_cta_tlacidla_parent_id_idx" ON "prispevky_blocks_cta_tlacidla" USING btree ("_parent_id");
  CREATE INDEX "prispevky_blocks_cta_order_idx" ON "prispevky_blocks_cta" USING btree ("_order");
  CREATE INDEX "prispevky_blocks_cta_parent_id_idx" ON "prispevky_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "prispevky_blocks_cta_path_idx" ON "prispevky_blocks_cta" USING btree ("_path");
  CREATE INDEX "prispevky_blocks_faq_otazky_order_idx" ON "prispevky_blocks_faq_otazky" USING btree ("_order");
  CREATE INDEX "prispevky_blocks_faq_otazky_parent_id_idx" ON "prispevky_blocks_faq_otazky" USING btree ("_parent_id");
  CREATE INDEX "prispevky_blocks_faq_order_idx" ON "prispevky_blocks_faq" USING btree ("_order");
  CREATE INDEX "prispevky_blocks_faq_parent_id_idx" ON "prispevky_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "prispevky_blocks_faq_path_idx" ON "prispevky_blocks_faq" USING btree ("_path");
  CREATE INDEX "prispevky_blocks_formular_order_idx" ON "prispevky_blocks_formular" USING btree ("_order");
  CREATE INDEX "prispevky_blocks_formular_parent_id_idx" ON "prispevky_blocks_formular" USING btree ("_parent_id");
  CREATE INDEX "prispevky_blocks_formular_path_idx" ON "prispevky_blocks_formular" USING btree ("_path");
  CREATE INDEX "prispevky_blocks_formular_formular_idx" ON "prispevky_blocks_formular" USING btree ("formular_id");
  CREATE INDEX "prispevky_blocks_video_order_idx" ON "prispevky_blocks_video" USING btree ("_order");
  CREATE INDEX "prispevky_blocks_video_parent_id_idx" ON "prispevky_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "prispevky_blocks_video_path_idx" ON "prispevky_blocks_video" USING btree ("_path");
  CREATE INDEX "prispevky_blocks_video_subor_idx" ON "prispevky_blocks_video" USING btree ("subor_id");
  CREATE INDEX "prispevky_blocks_video_nahlad_idx" ON "prispevky_blocks_video" USING btree ("nahlad_id");
  CREATE INDEX "prispevky_blocks_kod_order_idx" ON "prispevky_blocks_kod" USING btree ("_order");
  CREATE INDEX "prispevky_blocks_kod_parent_id_idx" ON "prispevky_blocks_kod" USING btree ("_parent_id");
  CREATE INDEX "prispevky_blocks_kod_path_idx" ON "prispevky_blocks_kod" USING btree ("_path");
  CREATE INDEX "prispevky_blocks_oddelovac_order_idx" ON "prispevky_blocks_oddelovac" USING btree ("_order");
  CREATE INDEX "prispevky_blocks_oddelovac_parent_id_idx" ON "prispevky_blocks_oddelovac" USING btree ("_parent_id");
  CREATE INDEX "prispevky_blocks_oddelovac_path_idx" ON "prispevky_blocks_oddelovac" USING btree ("_path");
  CREATE INDEX "prispevky_projekt_idx" ON "prispevky" USING btree ("projekt_id");
  CREATE INDEX "prispevky_slug_idx" ON "prispevky" USING btree ("slug");
  CREATE INDEX "prispevky_obrazok_idx" ON "prispevky" USING btree ("obrazok_id");
  CREATE INDEX "prispevky_seo_seo_obrazok_idx" ON "prispevky" USING btree ("seo_obrazok_id");
  CREATE INDEX "prispevky_vytvoril_idx" ON "prispevky" USING btree ("vytvoril_id");
  CREATE INDEX "prispevky_updated_at_idx" ON "prispevky" USING btree ("updated_at");
  CREATE INDEX "prispevky_created_at_idx" ON "prispevky" USING btree ("created_at");
  CREATE INDEX "prispevky__status_idx" ON "prispevky" USING btree ("_status");
  CREATE UNIQUE INDEX "projekt_slug_idx" ON "prispevky" USING btree ("projekt_id","slug");
  CREATE INDEX "prispevky_rels_order_idx" ON "prispevky_rels" USING btree ("order");
  CREATE INDEX "prispevky_rels_parent_idx" ON "prispevky_rels" USING btree ("parent_id");
  CREATE INDEX "prispevky_rels_path_idx" ON "prispevky_rels" USING btree ("path");
  CREATE INDEX "prispevky_rels_kategorie_id_idx" ON "prispevky_rels" USING btree ("kategorie_id");
  CREATE INDEX "prispevky_rels_media_id_idx" ON "prispevky_rels" USING btree ("media_id");
  CREATE INDEX "_prispevky_v_blocks_hero_tlacidla_order_idx" ON "_prispevky_v_blocks_hero_tlacidla" USING btree ("_order");
  CREATE INDEX "_prispevky_v_blocks_hero_tlacidla_parent_id_idx" ON "_prispevky_v_blocks_hero_tlacidla" USING btree ("_parent_id");
  CREATE INDEX "_prispevky_v_blocks_hero_order_idx" ON "_prispevky_v_blocks_hero" USING btree ("_order");
  CREATE INDEX "_prispevky_v_blocks_hero_parent_id_idx" ON "_prispevky_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "_prispevky_v_blocks_hero_path_idx" ON "_prispevky_v_blocks_hero" USING btree ("_path");
  CREATE INDEX "_prispevky_v_blocks_hero_pozadie_idx" ON "_prispevky_v_blocks_hero" USING btree ("pozadie_id");
  CREATE INDEX "_prispevky_v_blocks_text_order_idx" ON "_prispevky_v_blocks_text" USING btree ("_order");
  CREATE INDEX "_prispevky_v_blocks_text_parent_id_idx" ON "_prispevky_v_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "_prispevky_v_blocks_text_path_idx" ON "_prispevky_v_blocks_text" USING btree ("_path");
  CREATE INDEX "_prispevky_v_blocks_obrazok_order_idx" ON "_prispevky_v_blocks_obrazok" USING btree ("_order");
  CREATE INDEX "_prispevky_v_blocks_obrazok_parent_id_idx" ON "_prispevky_v_blocks_obrazok" USING btree ("_parent_id");
  CREATE INDEX "_prispevky_v_blocks_obrazok_path_idx" ON "_prispevky_v_blocks_obrazok" USING btree ("_path");
  CREATE INDEX "_prispevky_v_blocks_obrazok_obrazok_idx" ON "_prispevky_v_blocks_obrazok" USING btree ("obrazok_id");
  CREATE INDEX "_prispevky_v_blocks_galeria_order_idx" ON "_prispevky_v_blocks_galeria" USING btree ("_order");
  CREATE INDEX "_prispevky_v_blocks_galeria_parent_id_idx" ON "_prispevky_v_blocks_galeria" USING btree ("_parent_id");
  CREATE INDEX "_prispevky_v_blocks_galeria_path_idx" ON "_prispevky_v_blocks_galeria" USING btree ("_path");
  CREATE INDEX "_prispevky_v_blocks_vypis_order_idx" ON "_prispevky_v_blocks_vypis" USING btree ("_order");
  CREATE INDEX "_prispevky_v_blocks_vypis_parent_id_idx" ON "_prispevky_v_blocks_vypis" USING btree ("_parent_id");
  CREATE INDEX "_prispevky_v_blocks_vypis_path_idx" ON "_prispevky_v_blocks_vypis" USING btree ("_path");
  CREATE INDEX "_prispevky_v_blocks_vypis_kategoria_idx" ON "_prispevky_v_blocks_vypis" USING btree ("kategoria_id");
  CREATE INDEX "_prispevky_v_blocks_dlazdice_polozky_order_idx" ON "_prispevky_v_blocks_dlazdice_polozky" USING btree ("_order");
  CREATE INDEX "_prispevky_v_blocks_dlazdice_polozky_parent_id_idx" ON "_prispevky_v_blocks_dlazdice_polozky" USING btree ("_parent_id");
  CREATE INDEX "_prispevky_v_blocks_dlazdice_polozky_ikona_idx" ON "_prispevky_v_blocks_dlazdice_polozky" USING btree ("ikona_id");
  CREATE INDEX "_prispevky_v_blocks_dlazdice_order_idx" ON "_prispevky_v_blocks_dlazdice" USING btree ("_order");
  CREATE INDEX "_prispevky_v_blocks_dlazdice_parent_id_idx" ON "_prispevky_v_blocks_dlazdice" USING btree ("_parent_id");
  CREATE INDEX "_prispevky_v_blocks_dlazdice_path_idx" ON "_prispevky_v_blocks_dlazdice" USING btree ("_path");
  CREATE INDEX "_prispevky_v_blocks_cta_tlacidla_order_idx" ON "_prispevky_v_blocks_cta_tlacidla" USING btree ("_order");
  CREATE INDEX "_prispevky_v_blocks_cta_tlacidla_parent_id_idx" ON "_prispevky_v_blocks_cta_tlacidla" USING btree ("_parent_id");
  CREATE INDEX "_prispevky_v_blocks_cta_order_idx" ON "_prispevky_v_blocks_cta" USING btree ("_order");
  CREATE INDEX "_prispevky_v_blocks_cta_parent_id_idx" ON "_prispevky_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "_prispevky_v_blocks_cta_path_idx" ON "_prispevky_v_blocks_cta" USING btree ("_path");
  CREATE INDEX "_prispevky_v_blocks_faq_otazky_order_idx" ON "_prispevky_v_blocks_faq_otazky" USING btree ("_order");
  CREATE INDEX "_prispevky_v_blocks_faq_otazky_parent_id_idx" ON "_prispevky_v_blocks_faq_otazky" USING btree ("_parent_id");
  CREATE INDEX "_prispevky_v_blocks_faq_order_idx" ON "_prispevky_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_prispevky_v_blocks_faq_parent_id_idx" ON "_prispevky_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_prispevky_v_blocks_faq_path_idx" ON "_prispevky_v_blocks_faq" USING btree ("_path");
  CREATE INDEX "_prispevky_v_blocks_formular_order_idx" ON "_prispevky_v_blocks_formular" USING btree ("_order");
  CREATE INDEX "_prispevky_v_blocks_formular_parent_id_idx" ON "_prispevky_v_blocks_formular" USING btree ("_parent_id");
  CREATE INDEX "_prispevky_v_blocks_formular_path_idx" ON "_prispevky_v_blocks_formular" USING btree ("_path");
  CREATE INDEX "_prispevky_v_blocks_formular_formular_idx" ON "_prispevky_v_blocks_formular" USING btree ("formular_id");
  CREATE INDEX "_prispevky_v_blocks_video_order_idx" ON "_prispevky_v_blocks_video" USING btree ("_order");
  CREATE INDEX "_prispevky_v_blocks_video_parent_id_idx" ON "_prispevky_v_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "_prispevky_v_blocks_video_path_idx" ON "_prispevky_v_blocks_video" USING btree ("_path");
  CREATE INDEX "_prispevky_v_blocks_video_subor_idx" ON "_prispevky_v_blocks_video" USING btree ("subor_id");
  CREATE INDEX "_prispevky_v_blocks_video_nahlad_idx" ON "_prispevky_v_blocks_video" USING btree ("nahlad_id");
  CREATE INDEX "_prispevky_v_blocks_kod_order_idx" ON "_prispevky_v_blocks_kod" USING btree ("_order");
  CREATE INDEX "_prispevky_v_blocks_kod_parent_id_idx" ON "_prispevky_v_blocks_kod" USING btree ("_parent_id");
  CREATE INDEX "_prispevky_v_blocks_kod_path_idx" ON "_prispevky_v_blocks_kod" USING btree ("_path");
  CREATE INDEX "_prispevky_v_blocks_oddelovac_order_idx" ON "_prispevky_v_blocks_oddelovac" USING btree ("_order");
  CREATE INDEX "_prispevky_v_blocks_oddelovac_parent_id_idx" ON "_prispevky_v_blocks_oddelovac" USING btree ("_parent_id");
  CREATE INDEX "_prispevky_v_blocks_oddelovac_path_idx" ON "_prispevky_v_blocks_oddelovac" USING btree ("_path");
  CREATE INDEX "_prispevky_v_parent_idx" ON "_prispevky_v" USING btree ("parent_id");
  CREATE INDEX "_prispevky_v_version_version_projekt_idx" ON "_prispevky_v" USING btree ("version_projekt_id");
  CREATE INDEX "_prispevky_v_version_version_slug_idx" ON "_prispevky_v" USING btree ("version_slug");
  CREATE INDEX "_prispevky_v_version_version_obrazok_idx" ON "_prispevky_v" USING btree ("version_obrazok_id");
  CREATE INDEX "_prispevky_v_version_seo_version_seo_obrazok_idx" ON "_prispevky_v" USING btree ("version_seo_obrazok_id");
  CREATE INDEX "_prispevky_v_version_version_vytvoril_idx" ON "_prispevky_v" USING btree ("version_vytvoril_id");
  CREATE INDEX "_prispevky_v_version_version_updated_at_idx" ON "_prispevky_v" USING btree ("version_updated_at");
  CREATE INDEX "_prispevky_v_version_version_created_at_idx" ON "_prispevky_v" USING btree ("version_created_at");
  CREATE INDEX "_prispevky_v_version_version__status_idx" ON "_prispevky_v" USING btree ("version__status");
  CREATE INDEX "_prispevky_v_created_at_idx" ON "_prispevky_v" USING btree ("created_at");
  CREATE INDEX "_prispevky_v_updated_at_idx" ON "_prispevky_v" USING btree ("updated_at");
  CREATE INDEX "_prispevky_v_latest_idx" ON "_prispevky_v" USING btree ("latest");
  CREATE INDEX "_prispevky_v_autosave_idx" ON "_prispevky_v" USING btree ("autosave");
  CREATE INDEX "version_projekt_version_slug_idx" ON "_prispevky_v" USING btree ("version_projekt_id","version_slug");
  CREATE INDEX "_prispevky_v_rels_order_idx" ON "_prispevky_v_rels" USING btree ("order");
  CREATE INDEX "_prispevky_v_rels_parent_idx" ON "_prispevky_v_rels" USING btree ("parent_id");
  CREATE INDEX "_prispevky_v_rels_path_idx" ON "_prispevky_v_rels" USING btree ("path");
  CREATE INDEX "_prispevky_v_rels_kategorie_id_idx" ON "_prispevky_v_rels" USING btree ("kategorie_id");
  CREATE INDEX "_prispevky_v_rels_media_id_idx" ON "_prispevky_v_rels" USING btree ("media_id");
  CREATE INDEX "katalog_vlastnosti_order_idx" ON "katalog_vlastnosti" USING btree ("_order");
  CREATE INDEX "katalog_vlastnosti_parent_id_idx" ON "katalog_vlastnosti" USING btree ("_parent_id");
  CREATE INDEX "katalog_projekt_idx" ON "katalog" USING btree ("projekt_id");
  CREATE INDEX "katalog_slug_idx" ON "katalog" USING btree ("slug");
  CREATE INDEX "katalog_kategoria_idx" ON "katalog" USING btree ("kategoria_id");
  CREATE INDEX "katalog_obrazok_idx" ON "katalog" USING btree ("obrazok_id");
  CREATE INDEX "katalog_seo_seo_obrazok_idx" ON "katalog" USING btree ("seo_obrazok_id");
  CREATE INDEX "katalog_vytvoril_idx" ON "katalog" USING btree ("vytvoril_id");
  CREATE INDEX "katalog_updated_at_idx" ON "katalog" USING btree ("updated_at");
  CREATE INDEX "katalog_created_at_idx" ON "katalog" USING btree ("created_at");
  CREATE INDEX "katalog__status_idx" ON "katalog" USING btree ("_status");
  CREATE UNIQUE INDEX "projekt_slug_1_idx" ON "katalog" USING btree ("projekt_id","slug");
  CREATE INDEX "katalog_rels_order_idx" ON "katalog_rels" USING btree ("order");
  CREATE INDEX "katalog_rels_parent_idx" ON "katalog_rels" USING btree ("parent_id");
  CREATE INDEX "katalog_rels_path_idx" ON "katalog_rels" USING btree ("path");
  CREATE INDEX "katalog_rels_media_id_idx" ON "katalog_rels" USING btree ("media_id");
  CREATE INDEX "_katalog_v_version_vlastnosti_order_idx" ON "_katalog_v_version_vlastnosti" USING btree ("_order");
  CREATE INDEX "_katalog_v_version_vlastnosti_parent_id_idx" ON "_katalog_v_version_vlastnosti" USING btree ("_parent_id");
  CREATE INDEX "_katalog_v_parent_idx" ON "_katalog_v" USING btree ("parent_id");
  CREATE INDEX "_katalog_v_version_version_projekt_idx" ON "_katalog_v" USING btree ("version_projekt_id");
  CREATE INDEX "_katalog_v_version_version_slug_idx" ON "_katalog_v" USING btree ("version_slug");
  CREATE INDEX "_katalog_v_version_version_kategoria_idx" ON "_katalog_v" USING btree ("version_kategoria_id");
  CREATE INDEX "_katalog_v_version_version_obrazok_idx" ON "_katalog_v" USING btree ("version_obrazok_id");
  CREATE INDEX "_katalog_v_version_seo_version_seo_obrazok_idx" ON "_katalog_v" USING btree ("version_seo_obrazok_id");
  CREATE INDEX "_katalog_v_version_version_vytvoril_idx" ON "_katalog_v" USING btree ("version_vytvoril_id");
  CREATE INDEX "_katalog_v_version_version_updated_at_idx" ON "_katalog_v" USING btree ("version_updated_at");
  CREATE INDEX "_katalog_v_version_version_created_at_idx" ON "_katalog_v" USING btree ("version_created_at");
  CREATE INDEX "_katalog_v_version_version__status_idx" ON "_katalog_v" USING btree ("version__status");
  CREATE INDEX "_katalog_v_created_at_idx" ON "_katalog_v" USING btree ("created_at");
  CREATE INDEX "_katalog_v_updated_at_idx" ON "_katalog_v" USING btree ("updated_at");
  CREATE INDEX "_katalog_v_latest_idx" ON "_katalog_v" USING btree ("latest");
  CREATE INDEX "_katalog_v_autosave_idx" ON "_katalog_v" USING btree ("autosave");
  CREATE INDEX "version_projekt_version_slug_1_idx" ON "_katalog_v" USING btree ("version_projekt_id","version_slug");
  CREATE INDEX "_katalog_v_rels_order_idx" ON "_katalog_v_rels" USING btree ("order");
  CREATE INDEX "_katalog_v_rels_parent_idx" ON "_katalog_v_rels" USING btree ("parent_id");
  CREATE INDEX "_katalog_v_rels_path_idx" ON "_katalog_v_rels" USING btree ("path");
  CREATE INDEX "_katalog_v_rels_media_id_idx" ON "_katalog_v_rels" USING btree ("media_id");
  CREATE INDEX "udalosti_projekt_idx" ON "udalosti" USING btree ("projekt_id");
  CREATE INDEX "udalosti_slug_idx" ON "udalosti" USING btree ("slug");
  CREATE INDEX "udalosti_obrazok_idx" ON "udalosti" USING btree ("obrazok_id");
  CREATE INDEX "udalosti_kategoria_idx" ON "udalosti" USING btree ("kategoria_id");
  CREATE INDEX "udalosti_seo_seo_obrazok_idx" ON "udalosti" USING btree ("seo_obrazok_id");
  CREATE INDEX "udalosti_vytvoril_idx" ON "udalosti" USING btree ("vytvoril_id");
  CREATE INDEX "udalosti_updated_at_idx" ON "udalosti" USING btree ("updated_at");
  CREATE INDEX "udalosti_created_at_idx" ON "udalosti" USING btree ("created_at");
  CREATE INDEX "udalosti__status_idx" ON "udalosti" USING btree ("_status");
  CREATE UNIQUE INDEX "projekt_slug_2_idx" ON "udalosti" USING btree ("projekt_id","slug");
  CREATE INDEX "_udalosti_v_parent_idx" ON "_udalosti_v" USING btree ("parent_id");
  CREATE INDEX "_udalosti_v_version_version_projekt_idx" ON "_udalosti_v" USING btree ("version_projekt_id");
  CREATE INDEX "_udalosti_v_version_version_slug_idx" ON "_udalosti_v" USING btree ("version_slug");
  CREATE INDEX "_udalosti_v_version_version_obrazok_idx" ON "_udalosti_v" USING btree ("version_obrazok_id");
  CREATE INDEX "_udalosti_v_version_version_kategoria_idx" ON "_udalosti_v" USING btree ("version_kategoria_id");
  CREATE INDEX "_udalosti_v_version_seo_version_seo_obrazok_idx" ON "_udalosti_v" USING btree ("version_seo_obrazok_id");
  CREATE INDEX "_udalosti_v_version_version_vytvoril_idx" ON "_udalosti_v" USING btree ("version_vytvoril_id");
  CREATE INDEX "_udalosti_v_version_version_updated_at_idx" ON "_udalosti_v" USING btree ("version_updated_at");
  CREATE INDEX "_udalosti_v_version_version_created_at_idx" ON "_udalosti_v" USING btree ("version_created_at");
  CREATE INDEX "_udalosti_v_version_version__status_idx" ON "_udalosti_v" USING btree ("version__status");
  CREATE INDEX "_udalosti_v_created_at_idx" ON "_udalosti_v" USING btree ("created_at");
  CREATE INDEX "_udalosti_v_updated_at_idx" ON "_udalosti_v" USING btree ("updated_at");
  CREATE INDEX "_udalosti_v_latest_idx" ON "_udalosti_v" USING btree ("latest");
  CREATE INDEX "_udalosti_v_autosave_idx" ON "_udalosti_v" USING btree ("autosave");
  CREATE INDEX "version_projekt_version_slug_2_idx" ON "_udalosti_v" USING btree ("version_projekt_id","version_slug");
  CREATE INDEX "kategorie_pre_order_idx" ON "kategorie_pre" USING btree ("order");
  CREATE INDEX "kategorie_pre_parent_idx" ON "kategorie_pre" USING btree ("parent_id");
  CREATE INDEX "kategorie_projekt_idx" ON "kategorie" USING btree ("projekt_id");
  CREATE INDEX "kategorie_slug_idx" ON "kategorie" USING btree ("slug");
  CREATE INDEX "kategorie_vytvoril_idx" ON "kategorie" USING btree ("vytvoril_id");
  CREATE INDEX "kategorie_updated_at_idx" ON "kategorie" USING btree ("updated_at");
  CREATE INDEX "kategorie_created_at_idx" ON "kategorie" USING btree ("created_at");
  CREATE UNIQUE INDEX "projekt_slug_3_idx" ON "kategorie" USING btree ("projekt_id","slug");
  CREATE INDEX "media_projekt_idx" ON "media" USING btree ("projekt_id");
  CREATE INDEX "media_vytvoril_idx" ON "media" USING btree ("vytvoril_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_nahlad_sizes_nahlad_filename_idx" ON "media" USING btree ("sizes_nahlad_filename");
  CREATE INDEX "media_sizes_karta_sizes_karta_filename_idx" ON "media" USING btree ("sizes_karta_filename");
  CREATE INDEX "media_sizes_mobil_sizes_mobil_filename_idx" ON "media" USING btree ("sizes_mobil_filename");
  CREATE INDEX "subory_projekt_idx" ON "subory" USING btree ("projekt_id");
  CREATE INDEX "subory_vytvoril_idx" ON "subory" USING btree ("vytvoril_id");
  CREATE INDEX "subory_updated_at_idx" ON "subory" USING btree ("updated_at");
  CREATE INDEX "subory_created_at_idx" ON "subory" USING btree ("created_at");
  CREATE UNIQUE INDEX "subory_filename_idx" ON "subory" USING btree ("filename");
  CREATE INDEX "navigacia_polozky_podpolozky_order_idx" ON "navigacia_polozky_podpolozky" USING btree ("_order");
  CREATE INDEX "navigacia_polozky_podpolozky_parent_id_idx" ON "navigacia_polozky_podpolozky" USING btree ("_parent_id");
  CREATE INDEX "navigacia_polozky_podpolozky_stranka_idx" ON "navigacia_polozky_podpolozky" USING btree ("stranka_id");
  CREATE INDEX "navigacia_polozky_order_idx" ON "navigacia_polozky" USING btree ("_order");
  CREATE INDEX "navigacia_polozky_parent_id_idx" ON "navigacia_polozky" USING btree ("_parent_id");
  CREATE INDEX "navigacia_polozky_stranka_idx" ON "navigacia_polozky" USING btree ("stranka_id");
  CREATE INDEX "navigacia_projekt_idx" ON "navigacia" USING btree ("projekt_id");
  CREATE INDEX "navigacia_updated_at_idx" ON "navigacia" USING btree ("updated_at");
  CREATE INDEX "navigacia_created_at_idx" ON "navigacia" USING btree ("created_at");
  CREATE INDEX "nastavenia_webu_hodiny_order_idx" ON "nastavenia_webu_hodiny" USING btree ("_order");
  CREATE INDEX "nastavenia_webu_hodiny_parent_id_idx" ON "nastavenia_webu_hodiny" USING btree ("_parent_id");
  CREATE INDEX "nastavenia_webu_siete_order_idx" ON "nastavenia_webu_siete" USING btree ("_order");
  CREATE INDEX "nastavenia_webu_siete_parent_id_idx" ON "nastavenia_webu_siete" USING btree ("_parent_id");
  CREATE INDEX "nastavenia_webu_projekt_idx" ON "nastavenia_webu" USING btree ("projekt_id");
  CREATE INDEX "nastavenia_webu_logo_idx" ON "nastavenia_webu" USING btree ("logo_id");
  CREATE INDEX "nastavenia_webu_favicon_idx" ON "nastavenia_webu" USING btree ("favicon_id");
  CREATE INDEX "nastavenia_webu_obrazok_zdielania_idx" ON "nastavenia_webu" USING btree ("obrazok_zdielania_id");
  CREATE INDEX "nastavenia_webu_updated_at_idx" ON "nastavenia_webu" USING btree ("updated_at");
  CREATE INDEX "nastavenia_webu_created_at_idx" ON "nastavenia_webu" USING btree ("created_at");
  CREATE UNIQUE INDEX "projekt_idx" ON "nastavenia_webu" USING btree ("projekt_id");
  CREATE INDEX "presmerovania_projekt_idx" ON "presmerovania" USING btree ("projekt_id");
  CREATE INDEX "presmerovania_updated_at_idx" ON "presmerovania" USING btree ("updated_at");
  CREATE INDEX "presmerovania_created_at_idx" ON "presmerovania" USING btree ("created_at");
  CREATE UNIQUE INDEX "projekt_zo_idx" ON "presmerovania" USING btree ("projekt_id","zo");
  CREATE INDEX "formulare_polia_moznosti_order_idx" ON "formulare_polia_moznosti" USING btree ("_order");
  CREATE INDEX "formulare_polia_moznosti_parent_id_idx" ON "formulare_polia_moznosti" USING btree ("_parent_id");
  CREATE INDEX "formulare_polia_order_idx" ON "formulare_polia" USING btree ("_order");
  CREATE INDEX "formulare_polia_parent_id_idx" ON "formulare_polia" USING btree ("_parent_id");
  CREATE INDEX "formulare_prijemcovia_order_idx" ON "formulare_prijemcovia" USING btree ("_order");
  CREATE INDEX "formulare_prijemcovia_parent_id_idx" ON "formulare_prijemcovia" USING btree ("_parent_id");
  CREATE INDEX "formulare_projekt_idx" ON "formulare" USING btree ("projekt_id");
  CREATE INDEX "formulare_slug_idx" ON "formulare" USING btree ("slug");
  CREATE INDEX "formulare_updated_at_idx" ON "formulare" USING btree ("updated_at");
  CREATE INDEX "formulare_created_at_idx" ON "formulare" USING btree ("created_at");
  CREATE UNIQUE INDEX "projekt_slug_4_idx" ON "formulare" USING btree ("projekt_id","slug");
  CREATE INDEX "odpovede_projekt_idx" ON "odpovede" USING btree ("projekt_id");
  CREATE INDEX "odpovede_formular_idx" ON "odpovede" USING btree ("formular_id");
  CREATE INDEX "odpovede_updated_at_idx" ON "odpovede" USING btree ("updated_at");
  CREATE INDEX "odpovede_created_at_idx" ON "odpovede" USING btree ("created_at");
  CREATE INDEX "zaznamy_projekt_idx" ON "zaznamy" USING btree ("projekt_id");
  CREATE INDEX "zaznamy_kto_idx" ON "zaznamy" USING btree ("kto_id");
  CREATE INDEX "zaznamy_updated_at_idx" ON "zaznamy" USING btree ("updated_at");
  CREATE INDEX "zaznamy_created_at_idx" ON "zaznamy" USING btree ("created_at");
  CREATE INDEX "projekty_domeny_order_idx" ON "projekty_domeny" USING btree ("_order");
  CREATE INDEX "projekty_domeny_parent_id_idx" ON "projekty_domeny" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "projekty_kod_idx" ON "projekty" USING btree ("kod");
  CREATE INDEX "projekty_updated_at_idx" ON "projekty" USING btree ("updated_at");
  CREATE INDEX "projekty_created_at_idx" ON "projekty" USING btree ("created_at");
  CREATE INDEX "users_pristupy_order_idx" ON "users_pristupy" USING btree ("_order");
  CREATE INDEX "users_pristupy_parent_id_idx" ON "users_pristupy" USING btree ("_parent_id");
  CREATE INDEX "users_pristupy_projekt_idx" ON "users_pristupy" USING btree ("projekt_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "api_klienti_projekt_idx" ON "api_klienti" USING btree ("projekt_id");
  CREATE INDEX "api_klienti_updated_at_idx" ON "api_klienti" USING btree ("updated_at");
  CREATE INDEX "api_klienti_created_at_idx" ON "api_klienti" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_stranky_id_idx" ON "payload_locked_documents_rels" USING btree ("stranky_id");
  CREATE INDEX "payload_locked_documents_rels_prispevky_id_idx" ON "payload_locked_documents_rels" USING btree ("prispevky_id");
  CREATE INDEX "payload_locked_documents_rels_katalog_id_idx" ON "payload_locked_documents_rels" USING btree ("katalog_id");
  CREATE INDEX "payload_locked_documents_rels_udalosti_id_idx" ON "payload_locked_documents_rels" USING btree ("udalosti_id");
  CREATE INDEX "payload_locked_documents_rels_kategorie_id_idx" ON "payload_locked_documents_rels" USING btree ("kategorie_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_subory_id_idx" ON "payload_locked_documents_rels" USING btree ("subory_id");
  CREATE INDEX "payload_locked_documents_rels_navigacia_id_idx" ON "payload_locked_documents_rels" USING btree ("navigacia_id");
  CREATE INDEX "payload_locked_documents_rels_nastavenia_webu_id_idx" ON "payload_locked_documents_rels" USING btree ("nastavenia_webu_id");
  CREATE INDEX "payload_locked_documents_rels_presmerovania_id_idx" ON "payload_locked_documents_rels" USING btree ("presmerovania_id");
  CREATE INDEX "payload_locked_documents_rels_formulare_id_idx" ON "payload_locked_documents_rels" USING btree ("formulare_id");
  CREATE INDEX "payload_locked_documents_rels_odpovede_id_idx" ON "payload_locked_documents_rels" USING btree ("odpovede_id");
  CREATE INDEX "payload_locked_documents_rels_zaznamy_id_idx" ON "payload_locked_documents_rels" USING btree ("zaznamy_id");
  CREATE INDEX "payload_locked_documents_rels_projekty_id_idx" ON "payload_locked_documents_rels" USING btree ("projekty_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_api_klienti_id_idx" ON "payload_locked_documents_rels" USING btree ("api_klienti_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_rels_api_klienti_id_idx" ON "payload_preferences_rels" USING btree ("api_klienti_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "stranky_blocks_hero_tlacidla" CASCADE;
  DROP TABLE "stranky_blocks_hero" CASCADE;
  DROP TABLE "stranky_blocks_text" CASCADE;
  DROP TABLE "stranky_blocks_obrazok" CASCADE;
  DROP TABLE "stranky_blocks_galeria" CASCADE;
  DROP TABLE "stranky_blocks_vypis" CASCADE;
  DROP TABLE "stranky_blocks_dlazdice_polozky" CASCADE;
  DROP TABLE "stranky_blocks_dlazdice" CASCADE;
  DROP TABLE "stranky_blocks_cta_tlacidla" CASCADE;
  DROP TABLE "stranky_blocks_cta" CASCADE;
  DROP TABLE "stranky_blocks_faq_otazky" CASCADE;
  DROP TABLE "stranky_blocks_faq" CASCADE;
  DROP TABLE "stranky_blocks_formular" CASCADE;
  DROP TABLE "stranky_blocks_video" CASCADE;
  DROP TABLE "stranky_blocks_kod" CASCADE;
  DROP TABLE "stranky_blocks_oddelovac" CASCADE;
  DROP TABLE "stranky" CASCADE;
  DROP TABLE "stranky_rels" CASCADE;
  DROP TABLE "_stranky_v_blocks_hero_tlacidla" CASCADE;
  DROP TABLE "_stranky_v_blocks_hero" CASCADE;
  DROP TABLE "_stranky_v_blocks_text" CASCADE;
  DROP TABLE "_stranky_v_blocks_obrazok" CASCADE;
  DROP TABLE "_stranky_v_blocks_galeria" CASCADE;
  DROP TABLE "_stranky_v_blocks_vypis" CASCADE;
  DROP TABLE "_stranky_v_blocks_dlazdice_polozky" CASCADE;
  DROP TABLE "_stranky_v_blocks_dlazdice" CASCADE;
  DROP TABLE "_stranky_v_blocks_cta_tlacidla" CASCADE;
  DROP TABLE "_stranky_v_blocks_cta" CASCADE;
  DROP TABLE "_stranky_v_blocks_faq_otazky" CASCADE;
  DROP TABLE "_stranky_v_blocks_faq" CASCADE;
  DROP TABLE "_stranky_v_blocks_formular" CASCADE;
  DROP TABLE "_stranky_v_blocks_video" CASCADE;
  DROP TABLE "_stranky_v_blocks_kod" CASCADE;
  DROP TABLE "_stranky_v_blocks_oddelovac" CASCADE;
  DROP TABLE "_stranky_v" CASCADE;
  DROP TABLE "_stranky_v_rels" CASCADE;
  DROP TABLE "prispevky_blocks_hero_tlacidla" CASCADE;
  DROP TABLE "prispevky_blocks_hero" CASCADE;
  DROP TABLE "prispevky_blocks_text" CASCADE;
  DROP TABLE "prispevky_blocks_obrazok" CASCADE;
  DROP TABLE "prispevky_blocks_galeria" CASCADE;
  DROP TABLE "prispevky_blocks_vypis" CASCADE;
  DROP TABLE "prispevky_blocks_dlazdice_polozky" CASCADE;
  DROP TABLE "prispevky_blocks_dlazdice" CASCADE;
  DROP TABLE "prispevky_blocks_cta_tlacidla" CASCADE;
  DROP TABLE "prispevky_blocks_cta" CASCADE;
  DROP TABLE "prispevky_blocks_faq_otazky" CASCADE;
  DROP TABLE "prispevky_blocks_faq" CASCADE;
  DROP TABLE "prispevky_blocks_formular" CASCADE;
  DROP TABLE "prispevky_blocks_video" CASCADE;
  DROP TABLE "prispevky_blocks_kod" CASCADE;
  DROP TABLE "prispevky_blocks_oddelovac" CASCADE;
  DROP TABLE "prispevky" CASCADE;
  DROP TABLE "prispevky_rels" CASCADE;
  DROP TABLE "_prispevky_v_blocks_hero_tlacidla" CASCADE;
  DROP TABLE "_prispevky_v_blocks_hero" CASCADE;
  DROP TABLE "_prispevky_v_blocks_text" CASCADE;
  DROP TABLE "_prispevky_v_blocks_obrazok" CASCADE;
  DROP TABLE "_prispevky_v_blocks_galeria" CASCADE;
  DROP TABLE "_prispevky_v_blocks_vypis" CASCADE;
  DROP TABLE "_prispevky_v_blocks_dlazdice_polozky" CASCADE;
  DROP TABLE "_prispevky_v_blocks_dlazdice" CASCADE;
  DROP TABLE "_prispevky_v_blocks_cta_tlacidla" CASCADE;
  DROP TABLE "_prispevky_v_blocks_cta" CASCADE;
  DROP TABLE "_prispevky_v_blocks_faq_otazky" CASCADE;
  DROP TABLE "_prispevky_v_blocks_faq" CASCADE;
  DROP TABLE "_prispevky_v_blocks_formular" CASCADE;
  DROP TABLE "_prispevky_v_blocks_video" CASCADE;
  DROP TABLE "_prispevky_v_blocks_kod" CASCADE;
  DROP TABLE "_prispevky_v_blocks_oddelovac" CASCADE;
  DROP TABLE "_prispevky_v" CASCADE;
  DROP TABLE "_prispevky_v_rels" CASCADE;
  DROP TABLE "katalog_vlastnosti" CASCADE;
  DROP TABLE "katalog" CASCADE;
  DROP TABLE "katalog_rels" CASCADE;
  DROP TABLE "_katalog_v_version_vlastnosti" CASCADE;
  DROP TABLE "_katalog_v" CASCADE;
  DROP TABLE "_katalog_v_rels" CASCADE;
  DROP TABLE "udalosti" CASCADE;
  DROP TABLE "_udalosti_v" CASCADE;
  DROP TABLE "kategorie_pre" CASCADE;
  DROP TABLE "kategorie" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "subory" CASCADE;
  DROP TABLE "navigacia_polozky_podpolozky" CASCADE;
  DROP TABLE "navigacia_polozky" CASCADE;
  DROP TABLE "navigacia" CASCADE;
  DROP TABLE "nastavenia_webu_hodiny" CASCADE;
  DROP TABLE "nastavenia_webu_siete" CASCADE;
  DROP TABLE "nastavenia_webu" CASCADE;
  DROP TABLE "presmerovania" CASCADE;
  DROP TABLE "formulare_polia_moznosti" CASCADE;
  DROP TABLE "formulare_polia" CASCADE;
  DROP TABLE "formulare_prijemcovia" CASCADE;
  DROP TABLE "formulare" CASCADE;
  DROP TABLE "odpovede" CASCADE;
  DROP TABLE "zaznamy" CASCADE;
  DROP TABLE "projekty_domeny" CASCADE;
  DROP TABLE "projekty" CASCADE;
  DROP TABLE "users_pristupy" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "api_klienti" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."enum_stranky_blocks_hero_tlacidla_styl";
  DROP TYPE "public"."enum_stranky_blocks_hero_varianta";
  DROP TYPE "public"."enum_stranky_blocks_text_sirka";
  DROP TYPE "public"."enum_stranky_blocks_obrazok_sirka";
  DROP TYPE "public"."enum_stranky_blocks_galeria_rozlozenie";
  DROP TYPE "public"."enum_stranky_blocks_vypis_zdroj";
  DROP TYPE "public"."enum_stranky_blocks_vypis_rozlozenie";
  DROP TYPE "public"."enum_stranky_blocks_cta_tlacidla_styl";
  DROP TYPE "public"."enum_stranky_blocks_cta_varianta";
  DROP TYPE "public"."enum_stranky_blocks_oddelovac_velkost";
  DROP TYPE "public"."enum_stranky_status";
  DROP TYPE "public"."enum__stranky_v_blocks_hero_tlacidla_styl";
  DROP TYPE "public"."enum__stranky_v_blocks_hero_varianta";
  DROP TYPE "public"."enum__stranky_v_blocks_text_sirka";
  DROP TYPE "public"."enum__stranky_v_blocks_obrazok_sirka";
  DROP TYPE "public"."enum__stranky_v_blocks_galeria_rozlozenie";
  DROP TYPE "public"."enum__stranky_v_blocks_vypis_zdroj";
  DROP TYPE "public"."enum__stranky_v_blocks_vypis_rozlozenie";
  DROP TYPE "public"."enum__stranky_v_blocks_cta_tlacidla_styl";
  DROP TYPE "public"."enum__stranky_v_blocks_cta_varianta";
  DROP TYPE "public"."enum__stranky_v_blocks_oddelovac_velkost";
  DROP TYPE "public"."enum__stranky_v_version_status";
  DROP TYPE "public"."enum_prispevky_blocks_hero_tlacidla_styl";
  DROP TYPE "public"."enum_prispevky_blocks_hero_varianta";
  DROP TYPE "public"."enum_prispevky_blocks_text_sirka";
  DROP TYPE "public"."enum_prispevky_blocks_obrazok_sirka";
  DROP TYPE "public"."enum_prispevky_blocks_galeria_rozlozenie";
  DROP TYPE "public"."enum_prispevky_blocks_vypis_zdroj";
  DROP TYPE "public"."enum_prispevky_blocks_vypis_rozlozenie";
  DROP TYPE "public"."enum_prispevky_blocks_cta_tlacidla_styl";
  DROP TYPE "public"."enum_prispevky_blocks_cta_varianta";
  DROP TYPE "public"."enum_prispevky_blocks_oddelovac_velkost";
  DROP TYPE "public"."enum_prispevky_status";
  DROP TYPE "public"."enum__prispevky_v_blocks_hero_tlacidla_styl";
  DROP TYPE "public"."enum__prispevky_v_blocks_hero_varianta";
  DROP TYPE "public"."enum__prispevky_v_blocks_text_sirka";
  DROP TYPE "public"."enum__prispevky_v_blocks_obrazok_sirka";
  DROP TYPE "public"."enum__prispevky_v_blocks_galeria_rozlozenie";
  DROP TYPE "public"."enum__prispevky_v_blocks_vypis_zdroj";
  DROP TYPE "public"."enum__prispevky_v_blocks_vypis_rozlozenie";
  DROP TYPE "public"."enum__prispevky_v_blocks_cta_tlacidla_styl";
  DROP TYPE "public"."enum__prispevky_v_blocks_cta_varianta";
  DROP TYPE "public"."enum__prispevky_v_blocks_oddelovac_velkost";
  DROP TYPE "public"."enum__prispevky_v_version_status";
  DROP TYPE "public"."enum_katalog_status";
  DROP TYPE "public"."enum__katalog_v_version_status";
  DROP TYPE "public"."enum_udalosti_status";
  DROP TYPE "public"."enum__udalosti_v_version_status";
  DROP TYPE "public"."enum_kategorie_pre";
  DROP TYPE "public"."enum_navigacia_polozky_podpolozky_typ";
  DROP TYPE "public"."enum_navigacia_polozky_typ";
  DROP TYPE "public"."enum_navigacia_umiestnenie";
  DROP TYPE "public"."enum_nastavenia_webu_siete_siet";
  DROP TYPE "public"."enum_formulare_polia_typ";
  DROP TYPE "public"."enum_odpovede_stav";
  DROP TYPE "public"."enum_zaznamy_akcia";
  DROP TYPE "public"."enum_projekty_stav";
  DROP TYPE "public"."enum_users_pristupy_rola";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";`)
}
