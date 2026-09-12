import type { Field, RelationshipField } from "payload";

import { naCestu, naSlug } from "../../lib/text";
import { idZo, jeMaster, projektyPouzivatela } from "../access";

/**
 * Relácia, ktorá nikdy neponúkne cudzí projekt.
 *
 * Bez tohto by si editor jedného webu mohol vo výbere fotky preklikať do
 * knižnice druhého. Ponuka sa preto zužuje na projekt práve upravovaného
 * záznamu; kým nie je zvolený, ukáže sa aspoň to, na čo má človek právo.
 */
export const relaciaVProjekte = (
  relationTo: RelationshipField["relationTo"],
  konfig: Partial<RelationshipField> = {},
): RelationshipField =>
  ({
    type: "relationship",
    relationTo,
    ...konfig,
    filterOptions: ({ data, req, siblingData }) => {
      const projekt =
        idZo((data as { projekt?: unknown })?.projekt) ??
        idZo((siblingData as { projekt?: unknown })?.projekt);
      if (projekt !== null) return { projekt: { equals: projekt } };
      // Serverový zápis (endpoint, hook) beží bez prihláseného človeka —
      // obmedzovať ho tu by znamenalo, že vlastný kód neuloží nič.
      if (!req?.user || jeMaster(req.user)) return true;
      const moje = projektyPouzivatela(req.user);
      return moje.length ? { projekt: { in: moje } } : false;
    },
  }) as RelationshipField;

/**
 * Adresa záznamu na cudzom webe. Odvodí sa z názvu, ale ostáva prepísateľná —
 * raz zverejnená adresa sa nemá meniť len preto, že sa upravil nadpis.
 */
export const poleSlug = (zdroj = "nazov"): Field => ({
  name: "slug",
  label: "Adresa (slug)",
  type: "text",
  required: true,
  index: true,
  admin: {
    position: "sidebar",
    description:
      "Časť adresy za lomítkom. Doplní sa z názvu; keď je záznam vonku, radšej ju už nemeň.",
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        const zdrojovy = (data as Record<string, unknown> | undefined)?.[zdroj];
        const vstup =
          (typeof value === "string" && value.trim()) ||
          (typeof zdrojovy === "string" ? zdrojovy : "");
        return naSlug(vstup);
      },
    ],
  },
});

/** Celá cesta stránky vrátane úrovní: /o-nas/tim. */
export const poleCesty: Field = {
  name: "cesta",
  label: "Cesta na webe",
  type: "text",
  required: true,
  index: true,
  admin: {
    position: "sidebar",
    description: 'Napr. „/“ pre domov alebo „/o-nas/tim“ pre podstránku.',
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        const nazov = (data as { nazov?: unknown } | undefined)?.nazov;
        const vstup =
          (typeof value === "string" && value.trim()) ||
          (typeof nazov === "string" ? nazov : "");
        return naCestu(vstup);
      },
    ],
  },
};

/**
 * SEO. Nič z toho nie je povinné — keď ostane prázdne, delivery API dosadí
 * názov a perex záznamu. Vynútené polia by len naučili obsluhu kopírovať
 * nadpis do dvoch okienok.
 */
export const skupinaSeo: Field = {
  name: "seo",
  label: "SEO a zdieľanie",
  type: "group",
  admin: {
    description:
      "Čo o stránke ukáže Google a náhľad odkazu na sieťach. Prázdne polia sa dopĺňajú z obsahu.",
  },
  fields: [
    {
      name: "titulok",
      label: "Titulok vo vyhľadávaní",
      type: "text",
      admin: { description: "Do 60 znakov. Prázdne = názov záznamu." },
    },
    {
      name: "popis",
      label: "Popis vo vyhľadávaní",
      type: "textarea",
      admin: { description: "Do 160 znakov. Prázdne = perex záznamu." },
    },
    relaciaVProjekte("media", {
      name: "obrazok",
      label: "Obrázok pri zdieľaní",
      admin: { description: "Ukáže sa, keď niekto vloží odkaz na Facebook alebo do správy." },
    }),
    {
      name: "neindexovat",
      label: "Nezaraďovať do vyhľadávačov",
      type: "checkbox",
      defaultValue: false,
    },
  ],
};

/** Krátky text nad obsahom — používa ho výpis aj náhľad odkazu. */
export const polePerexu: Field = {
  name: "perex",
  label: "Perex",
  type: "textarea",
  admin: {
    description: "Dve–tri vety do výpisu a do náhľadu odkazu. Nepovinné.",
  },
};

export const poleStavu: Field = {
  name: "poradie",
  label: "Poradie",
  type: "number",
  defaultValue: 0,
  admin: {
    position: "sidebar",
    step: 1,
    description: "Nižšie číslo je vyššie vo výpise. Rovnaké čísla radí dátum.",
  },
};
