import type { CollectionConfig } from "payload";

import { citatObsah, filterAktivnehoProjektu, menitObsah, vytvaratObsah } from "../access";
import { hookyObsahu } from "../hooky";
import { overProjekt, poleProjektu, poleVytvoril, zapisVytvoril } from "../polia/projekt";

/**
 * Obrázková knižnica. Delená po projektoch ako všetko ostatné — editor
 * jedného webu sa cez výber fotky nemá ako preklikať do knižnice druhého.
 *
 * Rezy sú tri a záverečné. Každý ďalší je ďalší súbor v úložisku pri každom
 * nahratí; web si zvyšok dorieši cez `srcset` z toho, čo tu je.
 */
export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "Fotografia", plural: "Fotografie" },
  admin: {
    useAsTitle: "alt",
    defaultColumns: ["alt", "projekt", "updatedAt"],
    group: "Obsah",
    baseListFilter: filterAktivnehoProjektu,
    description:
      "Fotky pre tento projekt. Dajú sa vybrať všade, kde web zobrazuje obrázok.",
  },
  access: {
    read: citatObsah,
    create: vytvaratObsah,
    update: menitObsah,
    delete: menitObsah,
  },
  upload: {
    mimeTypes: ["image/*"],
    imageSizes: [
      { name: "nahlad", width: 400, height: 400, position: "centre" },
      { name: "karta", width: 1200, withoutEnlargement: true },
      { name: "mobil", width: 720, withoutEnlargement: true },
    ],
    focalPoint: true,
  },
  fields: [
    poleProjektu(),
    {
      name: "alt",
      label: "Popis pre nevidiacich (alt text)",
      type: "text",
      required: true,
      admin: {
        description: "Čo je na fotke, jednou vetou. Číta ju čítačka obrazovky aj Google.",
      },
    },
    {
      name: "popisok",
      label: "Popisok pod fotkou",
      type: "text",
      admin: { description: "Nepovinné. Web ho zobrazí pod obrázkom, ak s ním počíta." },
    },
    poleVytvoril,
  ],
  hooks: {
    beforeValidate: [overProjekt()],
    beforeChange: [zapisVytvoril],
    ...hookyObsahu,
  },
};
