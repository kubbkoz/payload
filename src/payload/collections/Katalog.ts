import type { CollectionConfig } from "payload";

import { citatObsah, filterAktivnehoProjektu, menitObsah, vytvaratObsah } from "../access";
import { hookyObsahu } from "../hooky";
import { obmedzZverejnenie, overProjekt, poleProjektu, poleVytvoril, zapisVytvoril } from "../polia/projekt";
import { polePerexu, poleSlug, poleStavu, relaciaVProjekte, skupinaSeo } from "../polia/spolocne";

/**
 * Univerzálny katalóg: jedálny lístok, cenník služieb, produkty, ubytovanie.
 *
 * Cena je text, nie číslo. V praxi to je „5 €“, „od 12 €“, „na dopyt“ alebo
 * „5 € / 0,1 l“ a číselné pole by z toho spravilo jedno číslo a poznámku,
 * ktorú by obsluha aj tak napísala inde. Kto potrebuje počítať, má na to
 * pole „cena číselne“ vedľa — to je ale doplnok, nie povinnosť.
 */
export const Katalog: CollectionConfig = {
  slug: "katalog",
  labels: { singular: "Položka katalógu", plural: "Katalóg" },
  admin: {
    useAsTitle: "nazov",
    defaultColumns: ["nazov", "cena", "kategoria", "projekt", "_status"],
    group: "Obsah",
    baseListFilter: filterAktivnehoProjektu,
    description: "Ponuka, cenník, produkty alebo služby — čokoľvek, čo má názov a cenu.",
  },
  access: {
    read: citatObsah,
    create: vytvaratObsah,
    update: menitObsah,
    delete: menitObsah,
  },
  versions: { drafts: { autosave: { interval: 1500 } }, maxPerDoc: 20 },
  indexes: [{ fields: ["projekt", "slug"], unique: true }],
  defaultSort: "poradie",
  fields: [
    poleProjektu(),
    { name: "nazov", label: "Názov", type: "text", required: true },
    poleSlug(),
    polePerexu,
    {
      type: "row",
      fields: [
        {
          name: "cena",
          label: "Cena",
          type: "text",
          admin: {
            width: "40%",
            description: 'Napr. „5 €“, „od 12 €“ alebo „na dopyt“. Prázdne sa nezobrazí.',
          },
        },
        {
          name: "cenaCislo",
          label: "Cena číselne",
          type: "number",
          admin: {
            width: "30%",
            description: "Nepovinné. Použije sa na zoradenie a filtrovanie podľa ceny.",
          },
        },
        {
          name: "jednotka",
          label: "Za jednotku",
          type: "text",
          admin: { width: "30%", description: 'Napr. „0,1 l“, „ks“, „noc“.' },
        },
      ],
    },
    relaciaVProjekte("kategorie", { name: "kategoria", label: "Kategória" }),
    relaciaVProjekte("media", { name: "obrazok", label: "Fotka" }),
    relaciaVProjekte("media", { name: "galeria", label: "Ďalšie fotky", hasMany: true }),
    { name: "popis", label: "Podrobný popis", type: "richText" },
    {
      name: "vlastnosti",
      label: "Parametre",
      type: "array",
      labels: { singular: "Parameter", plural: "Parametre" },
      admin: {
        description: "Dvojice názov – hodnota: Ročník / 2021, Kapacita / 4 osoby, Alergény / 1, 7.",
      },
      fields: [
        {
          type: "row",
          fields: [
            { name: "nazov", label: "Názov", type: "text", required: true, admin: { width: "40%" } },
            { name: "hodnota", label: "Hodnota", type: "text", required: true, admin: { width: "60%" } },
          ],
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "dostupne",
          label: "Je v ponuke",
          type: "checkbox",
          defaultValue: true,
          admin: { width: "50%", description: "Vypnuté: web ju ukáže ako nedostupnú alebo skryje." },
        },
        {
          name: "odporucane",
          label: "Vyzdvihnúť",
          type: "checkbox",
          defaultValue: false,
          admin: { width: "50%" },
        },
      ],
    },
    poleStavu,
    skupinaSeo,
    poleVytvoril,
  ],
  hooks: {
    beforeValidate: [overProjekt()],
    beforeChange: [zapisVytvoril, obmedzZverejnenie],
    ...hookyObsahu,
  },
};
