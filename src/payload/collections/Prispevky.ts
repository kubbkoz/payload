import type { CollectionConfig } from "payload";

import { citatObsah, filterAktivnehoProjektu, menitObsah, vytvaratObsah } from "../access";
import { VSETKY_BLOKY } from "../bloky/index";
import { hookyObsahu } from "../hooky";
import { obmedzZverejnenie, overProjekt, poleProjektu, poleVytvoril, zapisVytvoril } from "../polia/projekt";
import { polePerexu, poleSlug, relaciaVProjekte, skupinaSeo } from "../polia/spolocne";

/** Články, novinky, blog — čokoľvek, čo má dátum a radí sa od najnovšieho. */
export const Prispevky: CollectionConfig = {
  slug: "prispevky",
  labels: { singular: "Príspevok", plural: "Príspevky" },
  admin: {
    useAsTitle: "nazov",
    defaultColumns: ["nazov", "datum", "projekt", "_status", "updatedAt"],
    group: "Obsah",
    baseListFilter: filterAktivnehoProjektu,
    description: "Novinky a články. Vo výpise sa radia od najnovšieho.",
  },
  access: {
    read: citatObsah,
    create: vytvaratObsah,
    update: menitObsah,
    delete: menitObsah,
  },
  versions: {
    drafts: { autosave: { interval: 1500 }, schedulePublish: true },
    maxPerDoc: 30,
  },
  indexes: [{ fields: ["projekt", "slug"], unique: true }],
  defaultSort: "-datum",
  fields: [
    poleProjektu(),
    { name: "nazov", label: "Nadpis", type: "text", required: true },
    poleSlug(),
    {
      type: "row",
      fields: [
        {
          name: "datum",
          label: "Dátum zverejnenia",
          type: "date",
          required: true,
          defaultValue: () => new Date().toISOString(),
          admin: {
            width: "50%",
            date: { pickerAppearance: "dayOnly", displayFormat: "d. M. yyyy" },
          },
        },
        {
          name: "autorText",
          label: "Autor (meno pod článkom)",
          type: "text",
          admin: { width: "50%", description: "Prázdne = web meno autora neukáže." },
        },
      ],
    },
    polePerexu,
    relaciaVProjekte("media", { name: "obrazok", label: "Úvodná fotka" }),
    relaciaVProjekte("kategorie", {
      name: "kategorie",
      label: "Kategórie",
      hasMany: true,
    }),
    {
      name: "obsah",
      label: "Text článku",
      type: "richText",
    },
    {
      name: "bloky",
      label: "Doplnkové bloky pod článkom",
      type: "blocks",
      blocks: VSETKY_BLOKY,
      admin: {
        description: "Galéria, výzva k akcii, formulár — čokoľvek pod textom. Nepovinné.",
      },
    },
    {
      name: "odporucany",
      label: "Vyzdvihnúť na webe",
      type: "checkbox",
      defaultValue: false,
      admin: { position: "sidebar" },
    },
    skupinaSeo,
    poleVytvoril,
  ],
  hooks: {
    beforeValidate: [overProjekt()],
    beforeChange: [zapisVytvoril, obmedzZverejnenie],
    ...hookyObsahu,
  },
};
