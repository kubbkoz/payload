import type { CollectionConfig } from "payload";

import { citatObsah, filterAktivnehoProjektu, menitObsah, vytvaratObsah } from "../access";
import { hookyObsahu } from "../hooky";
import { overProjekt, poleProjektu, poleVytvoril, zapisVytvoril } from "../polia/projekt";

/**
 * Všetko, čo nie je fotka: PDF cenníky, jedálne lístky, videá, dokumenty.
 *
 * Oddelené od fotiek zámerne — Payload nad obrázkovou kolekciou robí rezy
 * a náhľady, čo pri dvadsaťmegovom PDF nedáva zmysel a pri videu to padne.
 */
export const Subory: CollectionConfig = {
  slug: "subory",
  labels: { singular: "Súbor", plural: "Súbory" },
  admin: {
    useAsTitle: "nazov",
    defaultColumns: ["nazov", "projekt", "updatedAt"],
    group: "Obsah",
    baseListFilter: filterAktivnehoProjektu,
    description: "PDF, dokumenty a videá na stiahnutie alebo vloženie do stránky.",
  },
  access: {
    read: citatObsah,
    create: vytvaratObsah,
    update: menitObsah,
    delete: menitObsah,
  },
  upload: {
    mimeTypes: ["application/pdf", "video/*", "audio/*", "text/*", "application/*"],
  },
  fields: [
    poleProjektu(),
    {
      name: "nazov",
      label: "Názov súboru",
      type: "text",
      required: true,
      admin: { description: 'Ako sa súbor volá na webe, napr. „Jedálny lístok 2026“.' },
    },
    poleVytvoril,
  ],
  hooks: {
    beforeValidate: [overProjekt()],
    beforeChange: [zapisVytvoril],
    ...hookyObsahu,
  },
};
