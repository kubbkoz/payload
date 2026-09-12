import type { CollectionConfig } from "payload";

import { citatObsah, filterAktivnehoProjektu, menitObsah, vytvaratObsah } from "../access";
import { VSETKY_BLOKY } from "../bloky/index";
import { hookyObsahu } from "../hooky";
import { obmedzZverejnenie, overProjekt, poleProjektu, poleVytvoril, zapisVytvoril } from "../polia/projekt";
import { poleCesty, polePerexu, skupinaSeo } from "../polia/spolocne";

/**
 * Stránky napojeného webu, skladané z blokov.
 *
 * Cesta je jedinečná v rámci projektu, nie globálne — dva weby pokojne majú
 * svoje vlastné „/kontakt“ a nemajú si do toho čo hovoriť. To je presne to,
 * čo zložený index nižšie vynucuje na úrovni databázy; kontrola v aplikácii by
 * sa dala obísť dvoma súbežnými uloženiami.
 */
export const Stranky: CollectionConfig = {
  slug: "stranky",
  labels: { singular: "Stránka", plural: "Stránky" },
  admin: {
    useAsTitle: "nazov",
    defaultColumns: ["nazov", "cesta", "projekt", "_status", "updatedAt"],
    group: "Obsah",
    baseListFilter: filterAktivnehoProjektu,
    description:
      "Podstránky webu poskladané z blokov. Web si ich ťahá cez API podľa cesty.",
  },
  access: {
    read: citatObsah,
    create: vytvaratObsah,
    update: menitObsah,
    delete: menitObsah,
  },
  versions: {
    drafts: {
      autosave: { interval: 1500 },
      schedulePublish: true,
    },
    maxPerDoc: 30,
  },
  indexes: [{ fields: ["projekt", "cesta"], unique: true }],
  defaultSort: "cesta",
  fields: [
    poleProjektu(),
    { name: "nazov", label: "Názov stránky", type: "text", required: true },
    poleCesty,
    polePerexu,
    {
      name: "bloky",
      label: "Obsah stránky",
      type: "blocks",
      blocks: VSETKY_BLOKY,
      admin: {
        description:
          "Bloky idú na webe zhora nadol v tomto poradí. Ťahaním ich prehodíš.",
      },
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
