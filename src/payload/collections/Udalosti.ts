import type { CollectionConfig } from "payload";

import { citatObsah, filterAktivnehoProjektu, menitObsah, vytvaratObsah } from "../access";
import { hookyObsahu } from "../hooky";
import { obmedzZverejnenie, overProjekt, poleProjektu, poleVytvoril, zapisVytvoril } from "../polia/projekt";
import { polePerexu, poleSlug, relaciaVProjekte, skupinaSeo } from "../polia/spolocne";

/**
 * Akcie s termínom. Dátum je nepovinný zámerne: časť ponuky (súkromné oslavy,
 * stále kurzy) beží priebežne a v zozname sa zobrazuje textom namiesto dátumu.
 * Delivery API odfiltruje to, čo už bolo — návštevník nemá čítať pozvánku na
 * akciu spred mesiaca.
 */
export const Udalosti: CollectionConfig = {
  slug: "udalosti",
  labels: { singular: "Udalosť", plural: "Udalosti" },
  admin: {
    useAsTitle: "nazov",
    defaultColumns: ["nazov", "datum", "projekt", "_status"],
    group: "Obsah",
    baseListFilter: filterAktivnehoProjektu,
    description: "Akcie, ochutnávky, kurzy a podujatia.",
  },
  access: {
    read: citatObsah,
    create: vytvaratObsah,
    update: menitObsah,
    delete: menitObsah,
  },
  versions: { drafts: { autosave: { interval: 1500 }, schedulePublish: true }, maxPerDoc: 20 },
  indexes: [{ fields: ["projekt", "slug"], unique: true }],
  defaultSort: "datum",
  fields: [
    poleProjektu(),
    { name: "nazov", label: "Názov akcie", type: "text", required: true },
    poleSlug(),
    polePerexu,
    {
      type: "row",
      fields: [
        {
          name: "datum",
          label: "Dátum",
          type: "date",
          admin: {
            width: "34%",
            date: { pickerAppearance: "dayOnly", displayFormat: "d. M. yyyy" },
            description: "Prázdne pri stálej ponuke bez termínu.",
          },
        },
        {
          name: "cas",
          label: "Začiatok",
          type: "text",
          admin: { width: "33%", description: "Napr. 19:00" },
        },
        {
          name: "terminText",
          label: "Termín textom",
          type: "text",
          admin: {
            width: "33%",
            description: 'Použije sa, keď je dátum prázdny. Napr. „Na objednávku“.',
          },
        },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "miesto", label: "Miesto", type: "text", admin: { width: "50%" } },
        {
          name: "vstupne",
          label: "Vstupné",
          type: "text",
          admin: { width: "50%", description: 'Napr. „5 €“ alebo „Vstup voľný“.' },
        },
      ],
    },
    relaciaVProjekte("media", { name: "obrazok", label: "Fotka akcie" }),
    relaciaVProjekte("kategorie", { name: "kategoria", label: "Kategória" }),
    { name: "popis", label: "Podrobný popis", type: "richText" },
    {
      name: "odkazNaVstupenky",
      label: "Odkaz na vstupenky alebo rezerváciu",
      type: "text",
    },
    {
      name: "odporucana",
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
