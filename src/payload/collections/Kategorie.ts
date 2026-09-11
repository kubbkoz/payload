import type { CollectionConfig } from "payload";

import { citatObsah, filterAktivnehoProjektu, menitObsah, vytvaratObsah } from "../access";
import { hookyObsahu } from "../hooky";
import { overProjekt, poleProjektu, poleVytvoril, zapisVytvoril } from "../polia/projekt";
import { poleSlug, poleStavu } from "../polia/spolocne";

/**
 * Jeden číselník na príspevky, katalóg aj udalosti.
 *
 * Tri samostatné taxonómie by boli tri zoznamy, ktoré vyzerajú rovnako a
 * obsluha v nich hľadá to isté. Pole „použiť pre“ ich odlíši vo výberoch a
 * ušetrí dve kolekcie.
 */
export const Kategorie: CollectionConfig = {
  slug: "kategorie",
  labels: { singular: "Kategória", plural: "Kategórie" },
  admin: {
    useAsTitle: "nazov",
    defaultColumns: ["nazov", "pre", "projekt", "poradie"],
    group: "Obsah",
    baseListFilter: filterAktivnehoProjektu,
    description: "Triedenie príspevkov, katalógu a udalostí.",
  },
  access: {
    read: citatObsah,
    create: vytvaratObsah,
    update: menitObsah,
    delete: menitObsah,
  },
  indexes: [{ fields: ["projekt", "slug"], unique: true }],
  defaultSort: "poradie",
  fields: [
    poleProjektu(),
    { name: "nazov", label: "Názov", type: "text", required: true },
    poleSlug(),
    {
      name: "pre",
      label: "Použiť pre",
      type: "select",
      hasMany: true,
      defaultValue: ["prispevky"],
      options: [
        { label: "Príspevky", value: "prispevky" },
        { label: "Katalóg", value: "katalog" },
        { label: "Udalosti", value: "udalosti" },
      ],
      admin: { description: "Kde sa kategória ponúkne vo výbere." },
    },
    { name: "popis", label: "Popis", type: "textarea" },
    poleStavu,
    poleVytvoril,
  ],
  hooks: {
    beforeValidate: [overProjekt()],
    beforeChange: [zapisVytvoril],
    ...hookyObsahu,
  },
};
