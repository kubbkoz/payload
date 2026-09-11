import type { CollectionConfig } from "payload";

import { citatObsah, filterAktivnehoProjektu, spravovatProjekt, vytvaratVProjekte } from "../access";
import { hookyObsahu } from "../hooky";
import { overProjekt, poleProjektu } from "../polia/projekt";
import { naCestu } from "../../lib/text";

/**
 * Presmerovania starých adries. Web si ich stiahne jedným dotazom a preloží
 * do vlastného middleware — hub ich len eviduje. Bez tohto sa pri každej
 * prestavbe webu stratí to, čo už má Google v indexe.
 */
export const Presmerovania: CollectionConfig = {
  slug: "presmerovania",
  labels: { singular: "Presmerovanie", plural: "Presmerovania" },
  admin: {
    useAsTitle: "zo",
    defaultColumns: ["zo", "na", "trvale", "projekt"],
    group: "Štruktúra webu",
    baseListFilter: filterAktivnehoProjektu,
    description: "Stará adresa → nová adresa. Web si ich ťahá pri štarte.",
  },
  access: {
    read: citatObsah,
    create: vytvaratVProjekte,
    update: spravovatProjekt,
    delete: spravovatProjekt,
  },
  indexes: [{ fields: ["projekt", "zo"], unique: true }],
  fields: [
    poleProjektu("spravca"),
    {
      name: "zo",
      label: "Stará adresa",
      type: "text",
      required: true,
      admin: { description: "Cesta na webe, napr. /stara-stranka" },
      hooks: {
        beforeValidate: [({ value }) => (typeof value === "string" ? naCestu(value) : value)],
      },
    },
    {
      name: "na",
      label: "Nová adresa",
      type: "text",
      required: true,
      admin: { description: "Cesta alebo celá adresa vrátane https://" },
    },
    {
      name: "trvale",
      label: "Trvalé presmerovanie (301)",
      type: "checkbox",
      defaultValue: true,
      admin: { description: "Vypnuté = dočasné (307). Trvalé si zapamätá aj prehliadač." },
    },
  ],
  hooks: {
    beforeValidate: [overProjekt("spravca")],
    ...hookyObsahu,
  },
};
