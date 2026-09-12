#!/usr/bin/env node
/**
 * Obálka nad `payload migrate:create`.
 *
 * Payload generuje hlavičku `import { MigrateUpArgs, MigrateDownArgs, sql }`,
 * kde sú prvé dve iba typy. Node 22 spúšťa tieto súbory cez odstránenie typov
 * a keďže nie sú označené ako `import type`, pokúsi sa ich naozaj naimportovať
 * a migrácia spadne na „does not provide an export named MigrateDownArgs“.
 * Tento skript hlavičku po vygenerovaní prepíše — ručná oprava po každej
 * migrácii je vec, na ktorú sa raz zabudne a zistí sa to až pri deployi.
 */
import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const koren = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const priecinok = path.join(koren, "src", "migrations");

const STARA =
  /^import \{ MigrateUpArgs, MigrateDownArgs, sql \} from '@payloadcms\/db-postgres'$/m;
const NOVA = [
  "import { sql } from '@payloadcms/db-postgres'",
  "import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'",
].join("\n");

export const opravHlavicky = () => {
  let opravene = 0;
  for (const subor of readdirSync(priecinok)) {
    if (!subor.endsWith(".ts") || subor === "index.ts") continue;
    const cesta = path.join(priecinok, subor);
    const obsah = readFileSync(cesta, "utf8");
    if (!STARA.test(obsah)) continue;
    writeFileSync(cesta, obsah.replace(STARA, NOVA), "utf8");
    console.log(`Opravená hlavička: ${subor}`);
    opravene += 1;
  }
  return opravene;
};

const priamoSpustene = process.argv[1] === fileURLToPath(import.meta.url);

if (priamoSpustene) {
  const argumenty = process.argv.slice(2);
  if (argumenty[0] !== "--iba-oprava") {
    const vysledok = spawnSync(
      process.execPath,
      [
        "--experimental-strip-types",
        "--experimental-transform-types",
        "--import",
        "./scripts/register-ts-resolve.mjs",
        "node_modules/.bin/payload",
        "migrate:create",
        "--disable-transpile",
        ...argumenty,
      ],
      { cwd: koren, stdio: "inherit" },
    );
    if (vysledok.status !== 0) process.exit(vysledok.status ?? 1);
  }
  opravHlavicky();
}
