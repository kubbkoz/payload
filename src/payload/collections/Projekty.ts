import type { CollectionConfig } from "payload";

import { jeMaster, projektyPouzivatela } from "../access";
import { KOLEKCIE_PROJEKTU } from "../kolekcie";
import { naSlug } from "../../lib/text";

/**
 * Projekt = jeden web napojený na tento hub.
 *
 * Je to koreň všetkého. Každý obsahový záznam v systéme ukazuje na jeden
 * riadok tejto tabuľky a bez neho neexistuje. Projekt zakladá výhradne master;
 * správca projektu si ho smie prezerať a upraviť jeho údaje, ale nový web
 * ani zmazanie existujúceho v jeho rukách nie sú.
 *
 * Doménky nie sú kozmetika: skladá sa z nich zoznam povolených pôvodov pre
 * delivery API. Čo tu nie je napísané, to si obsah z prehliadača nestiahne.
 */
export const Projekty: CollectionConfig = {
  slug: "projekty",
  labels: { singular: "Projekt", plural: "Projekty" },
  admin: {
    useAsTitle: "nazov",
    defaultColumns: ["nazov", "kod", "stav", "domenaHlavna", "updatedAt"],
    group: "Systém",
    description:
      "Weby napojené na túto administráciu. Každý záznam v systéme patrí práve jednému z nich.",
  },
  access: {
    read: ({ req }) => {
      if (jeMaster(req.user)) return true;
      const moje = projektyPouzivatela(req.user);
      return moje.length ? { id: { in: moje } } : false;
    },
    create: ({ req }) => jeMaster(req.user),
    update: ({ req }) => {
      if (jeMaster(req.user)) return true;
      const moje = projektyPouzivatela(req.user, "spravca");
      return moje.length ? { id: { in: moje } } : false;
    },
    delete: ({ req }) => jeMaster(req.user),
  },
  defaultSort: "nazov",
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "nazov",
          label: "Názov projektu",
          type: "text",
          required: true,
          admin: { width: "60%", description: "Ako sa web volá v administrácii." },
        },
        {
          name: "stav",
          label: "Stav",
          type: "select",
          required: true,
          defaultValue: "aktivny",
          options: [
            { label: "Aktívny", value: "aktivny" },
            { label: "Vo výstavbe", value: "vystavba" },
            { label: "Pozastavený", value: "pozastaveny" },
            { label: "Archivovaný", value: "archiv" },
          ],
          admin: {
            width: "40%",
            description:
              "Pozastavený a archivovaný projekt prestane cez API vydávať obsah. V administrácii ostáva.",
          },
        },
      ],
    },
    {
      name: "kod",
      label: "Kód projektu",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: {
        description:
          "Používa sa v adrese API: /api/web/<kód>/stranky. Krátko, bez diakritiky, nemeniť po nasadení.",
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            const nazov = (data as { nazov?: unknown } | undefined)?.nazov;
            const vstup =
              (typeof value === "string" && value.trim()) ||
              (typeof nazov === "string" ? nazov : "");
            return naSlug(vstup);
          },
        ],
      },
    },
    {
      name: "popis",
      label: "Poznámka",
      type: "textarea",
      admin: { description: "Pre koho web je, čo na ňom beží, na čo si dať pozor." },
    },
    {
      type: "collapsible",
      label: "Domény",
      admin: {
        description:
          "Adresy, na ktorých web beží. Z tohto zoznamu vzniká zoznam povolených pôvodov pre API — čo tu nie je, to obsah z prehliadača nedostane.",
      },
      fields: [
        {
          name: "domenaHlavna",
          label: "Hlavná doména",
          type: "text",
          admin: { description: "Napr. https://vinaren.zjav.sk — aj s protokolom." },
        },
        {
          name: "domeny",
          label: "Ďalšie domény a náhľady",
          type: "array",
          labels: { singular: "Doména", plural: "Domény" },
          admin: {
            description: "Vercel náhľady, www varianta, staré domény so 301.",
          },
          fields: [
            {
              name: "adresa",
              label: "Adresa",
              type: "text",
              required: true,
              admin: { description: "https://nieco.vercel.app alebo http://localhost:3001" },
            },
          ],
        },
      ],
    },
    {
      type: "collapsible",
      label: "Napojenie webu",
      admin: {
        description:
          "Ako si web berie obsah a ako sa dozvie, že sa niečo zmenilo.",
      },
      fields: [
        {
          name: "verejneCitanie",
          label: "Obsah dostupný bez kľúča",
          type: "checkbox",
          defaultValue: true,
          admin: {
            description:
              "Zapnuté: zverejnený obsah si stiahne ktokoľvek z povolených domén — to je pre bežný verejný web správne. Vypnuté: každá požiadavka musí mať API kľúč.",
          },
        },
        {
          name: "revalidateUrl",
          label: "Adresa na prepláchnutie webu",
          type: "text",
          admin: {
            description:
              "Po každej zmene obsahu sem hub pošle POST, aby si web zahodil vyrenderovanú kópiu. Napr. https://web.sk/api/revalidate",
          },
        },
        {
          name: "revalidateSecret",
          label: "Tajomstvo pre prepláchnutie",
          type: "text",
          admin: {
            description:
              "Pošle sa v hlavičke x-hub-secret. Web si ním overí, že požiadavka je naozaj z hubu.",
          },
        },
      ],
    },
    {
      name: "farba",
      label: "Farba projektu",
      type: "text",
      defaultValue: "#00cfff",
      admin: {
        position: "sidebar",
        description: "Odlíši projekt v prepínači a na nástenke. Hex, napr. #00cfff.",
      },
    },
  ],
  hooks: {
    afterChange: [
      /**
       * Nový projekt dostane rovno svoj riadok nastavení. Bez toho by správca
       * po prvom prihlásení našiel prázdny zoznam a musel by uhádnuť, že si
       * má nastavenia najprv vyrobiť.
       */
      async ({ doc, operation, req }) => {
        if (operation !== "create") return doc;
        try {
          const existuje = await req.payload.count({
            collection: "nastavenia-webu",
            where: { projekt: { equals: doc.id } },
            req,
            overrideAccess: true,
          });
          if (existuje.totalDocs === 0) {
            await req.payload.create({
              collection: "nastavenia-webu",
              data: { projekt: doc.id, nazovWebu: doc.nazov },
              // `req` je tu podstatné: hook beží vnútri transakcie, v ktorej
              // projekt ešte len vzniká. Bez neho by zápis bežal mimo nej,
              // nový projekt by nevidel a relácia by skončila na „neplatný výber“.
              req,
              overrideAccess: true,
              context: { preskocKontrolu: true, preskocPreplach: true, preskocZaznam: true },
            });
          }
        } catch (chyba) {
          req.payload.logger.error(
            { chyba },
            "Nepodarilo sa založiť nastavenia pre nový projekt.",
          );
        }
        return doc;
      },
    ],
    beforeDelete: [
      /**
       * Kaskáda musí bežať PRED zmazaním projektu, nie po ňom.
       *
       * Payload zakladá cudzie kľúče s `ON DELETE SET NULL`. Keby sa obsah
       * domazával až potom, databáza by pri mazaní projektu najprv skúsila
       * zapísať NULL do stĺpca `projekt_id`, ktorý je NOT NULL — a celé
       * mazanie by padlo na porušenej podmienke. Takto v okamihu, keď sa
       * projekt maže, už na neho nič neukazuje.
       *
       * Bez kaskády by zmazaný projekt po sebe nechal stránky, fotky a
       * odpovede z formulárov, ktoré už nikomu nepatria.
       */
      async ({ id, req }) => {
        for (const kolekcia of KOLEKCIE_PROJEKTU) {
          try {
            await req.payload.delete({
              collection: kolekcia,
              where: { projekt: { equals: id } },
              req,
              overrideAccess: true,
              context: { preskocKontrolu: true, preskocPreplach: true, preskocZaznam: true },
            });
          } catch (chyba) {
            req.payload.logger.error(
              { chyba, kolekcia },
              "Nepodarilo sa domazať obsah zmazaného projektu.",
            );
          }
        }
        try {
          await req.payload.delete({
            collection: "api-klienti",
            where: { projekt: { equals: id } },
            req,
            overrideAccess: true,
            context: { preskocKontrolu: true },
          });
        } catch {
          /* kľúče bez projektu aj tak neprejdú kontrolou prístupu */
        }
      },
    ],
  },
};
