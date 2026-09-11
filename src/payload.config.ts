import path from "path";
import { fileURLToPath } from "url";

import { postgresAdapter } from "@payloadcms/db-postgres";
import { resendAdapter } from "@payloadcms/email-resend";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { sk } from "@payloadcms/translations/languages/sk";
import { buildConfig } from "payload";
import sharp from "sharp";

import { ApiKlienti } from "./payload/collections/ApiKlienti";
import { Formulare } from "./payload/collections/Formulare";
import { Katalog } from "./payload/collections/Katalog";
import { Kategorie } from "./payload/collections/Kategorie";
import { Media } from "./payload/collections/Media";
import { NastaveniaWebu } from "./payload/collections/NastaveniaWebu";
import { Navigacia } from "./payload/collections/Navigacia";
import { Odpovede } from "./payload/collections/Odpovede";
import { Presmerovania } from "./payload/collections/Presmerovania";
import { Prispevky } from "./payload/collections/Prispevky";
import { Projekty } from "./payload/collections/Projekty";
import { Stranky } from "./payload/collections/Stranky";
import { Subory } from "./payload/collections/Subory";
import { Udalosti } from "./payload/collections/Udalosti";
import { Users } from "./payload/collections/Users";
import { Zaznamy } from "./payload/collections/Zaznamy";
import { ENDPOINTY } from "./payload/endpointy";
import { migrations } from "./migrations/index";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
const resendKey = process.env.RESEND_API_KEY;

const serverURL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : undefined);

// Postgres príde raz ako DATABASE_URI (lokálne), raz ako DATABASE_URL alebo
// POSTGRES_URL (Vercel / Neon integrácia). Fallback na localhost je zámerný:
// build bez databázy má zlyhať okamžite na odmietnutom spojení, nie visieť.
const connectionString =
  process.env.DATABASE_URI ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  "postgres://unset:unset@localhost:5432/unset";

export default buildConfig({
  serverURL,
  admin: {
    user: Users.slug,
    theme: "light",
    // Vlastné komponenty sa hľadajú od src/, takže "/payload/admin/Foo#Foo"
    // vedie na src/payload/admin/Foo.tsx. Bez toho ich generate:importmap
    // hľadá od koreňa projektu a nenájde.
    importMap: { baseDir: dirname },
    components: {
      providers: ["/payload/admin/HubStyl#HubStyl"],
      beforeNavLinks: ["/payload/admin/PrepinacProjektu#PrepinacProjektu"],
      beforeDashboard: ["/payload/admin/Nastenka#Nastenka"],
    },
    meta: {
      titleSuffix: " · HUB",
      description: "Spoločná administrácia pre všetky napojené weby.",
    },
  },
  /**
   * Poradie je poradím v bočnom menu (v rámci skupiny). Hore je to, čoho sa
   * obsluha dotkne denne, dole systémové veci, ktoré master otvorí raz za mesiac.
   */
  collections: [
    Stranky,
    Prispevky,
    Katalog,
    Udalosti,
    Kategorie,
    Media,
    Subory,
    Navigacia,
    NastaveniaWebu,
    Presmerovania,
    Formulare,
    Odpovede,
    Zaznamy,
    Projekty,
    Users,
    ApiKlienti,
  ],
  endpoints: ENDPOINTY,
  editor: lexicalEditor(),
  i18n: {
    supportedLanguages: { sk },
    fallbackLanguage: "sk",
    translations: {
      sk: {
        version: {
          draft: "Koncept",
          draftSavedSuccessfully: "Koncept uložený.",
          saveDraft: "Uložiť koncept",
        },
      },
    },
  },
  secret: process.env.PAYLOAD_SECRET || "dev-only-insecure-secret-change-me",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: { connectionString },
    migrationDir: path.resolve(dirname, "migrations"),
    // Dev push je vypnutý všade, nielen v produkcii. Jeden `next dev` proti
    // databáze do nej zapíše riadok batch = -1 a od tej chvíle sa každé
    // migrate — vrátane prodMigrations nižšie — zastaví na interaktívnej
    // otázke „data loss may occur“, ktorú serverless boot nemá ako zodpovedať.
    push: false,
    // Prázdna databáza sa z nich pri prvom produkčnom štarte naštartuje sama.
    prodMigrations: migrations,
  }),
  sharp,
  /**
   * Naplánované zverejnenie beží ako úloha vo fronte. Fronta sa spúšťa cronom
   * na /api/payload-jobs/run — Vercel k nemu posiela CRON_SECRET, takže sa
   * endpoint nedá vyvolať zvonku.
   */
  jobs: {
    access: {
      run: ({ req }) => {
        const tajomstvo = process.env.CRON_SECRET;
        if (tajomstvo && req.headers.get("authorization") === `Bearer ${tajomstvo}`) return true;
        return Boolean(req.user && (req.user as { master?: boolean }).master);
      },
    },
  },
  // Administrácia beží na vlastnej doméne; delivery API si CORS rieši samo
  // podľa domén zapísaných pri projekte.
  cors: serverURL ? [serverURL] : [],
  csrf: serverURL ? [serverURL] : [],
  ...(resendKey
    ? {
        email: resendAdapter({
          defaultFromAddress: (process.env.EMAIL_FROM ?? "cms@example.com")
            .replace(/^.*</, "")
            .replace(/>.*$/, ""),
          defaultFromName: process.env.EMAIL_FROM?.includes("<")
            ? process.env.EMAIL_FROM.split("<")[0]!.trim()
            : "HUB CMS",
          apiKey: resendKey,
        }),
      }
    : {}),
  plugins: [
    ...(blobToken
      ? [
          vercelBlobStorage({
            enabled: true,
            collections: { media: true, subory: true },
            token: blobToken,
            // Bez toho sa väčší súbor nenahrá: telo požiadavky do serverless
            // funkcie má strop 4,5 MB. Takto ide súbor z prehliadača rovno
            // do úložiska.
            clientUploads: true,
          }),
        ]
      : []),
  ],
  /**
   * Prvý master z premenných prostredia. Keď nie sú vyplnené, Payload ponúkne
   * bežnú obrazovku „vytvor prvého používateľa“ a hook v kolekcii Users z neho
   * spraví mastera.
   */
  onInit: async (payload) => {
    const email = process.env.HUB_ADMIN_EMAIL;
    const heslo = process.env.HUB_ADMIN_PASSWORD;
    if (!email || !heslo) return;

    try {
      const { totalDocs } = await payload.count({ collection: "users", overrideAccess: true });
      if (totalDocs > 0) return;

      await payload.create({
        collection: "users",
        data: { email, password: heslo, meno: "Master", master: true, aktivny: true },
        overrideAccess: true,
      });
      payload.logger.info(`Vytvorený prvý master: ${email}`);
    } catch (chyba) {
      payload.logger.error({ chyba }, "Prvého mastera sa nepodarilo vytvoriť.");
    }
  },
});
