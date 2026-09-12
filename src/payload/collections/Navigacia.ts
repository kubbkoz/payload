import type { CollectionConfig, Field } from "payload";

import { filterAktivnehoProjektu, citatObsah, spravovatProjekt, vytvaratVProjekte } from "../access";
import { hookyObsahu } from "../hooky";
import { overProjekt, poleProjektu } from "../polia/projekt";
import { relaciaVProjekte } from "../polia/spolocne";

/**
 * Menu webu. Nie je to global, hoci sa tak správa — globaly v Payloade existujú
 * v jedinej inštancii a v systéme s dvadsiatimi webmi by to znamenalo jedno
 * menu pre všetkých. Preto kolekcia, kde jeden riadok = jedno menu jedného
 * projektu na jednom mieste (hlavička, pätička, vedľajší stĺpec).
 */

const odkaz = (nazov: string, popis: string): Field => ({
  type: "collapsible",
  label: nazov,
  admin: { description: popis },
  fields: [
    {
      type: "row",
      fields: [
        { name: "text", label: "Text v menu", type: "text", required: true, admin: { width: "40%" } },
        {
          name: "typ",
          label: "Kam vedie",
          type: "select",
          required: true,
          defaultValue: "stranka",
          options: [
            { label: "Stránka v systéme", value: "stranka" },
            { label: "Vlastná adresa", value: "adresa" },
          ],
          admin: { width: "30%" },
        },
        {
          name: "novaKarta",
          label: "Otvoriť v novom okne",
          type: "checkbox",
          defaultValue: false,
          admin: { width: "30%" },
        },
      ],
    },
    relaciaVProjekte("stranky", {
      name: "stranka",
      label: "Stránka",
      admin: { condition: (_d, siblingData) => siblingData?.typ === "stranka" },
    }),
    {
      name: "adresa",
      label: "Adresa",
      type: "text",
      admin: {
        condition: (_d, siblingData) => siblingData?.typ === "adresa",
        description: "Napr. /kontakt, https://instagram.com/… alebo tel:+421…",
      },
    },
  ],
});

export const Navigacia: CollectionConfig = {
  slug: "navigacia",
  labels: { singular: "Menu", plural: "Menu" },
  admin: {
    useAsTitle: "nazov",
    defaultColumns: ["nazov", "umiestnenie", "projekt", "updatedAt"],
    group: "Štruktúra webu",
    baseListFilter: filterAktivnehoProjektu,
    description: "Odkazy v hlavičke, pätičke a vedľajších zoznamoch.",
  },
  access: {
    read: citatObsah,
    create: vytvaratVProjekte,
    update: spravovatProjekt,
    delete: spravovatProjekt,
  },
  fields: [
    poleProjektu("spravca"),
    {
      type: "row",
      fields: [
        {
          name: "nazov",
          label: "Názov menu",
          type: "text",
          required: true,
          admin: { width: "50%", description: 'Len pre orientáciu, napr. „Hlavné menu“.' },
        },
        {
          name: "umiestnenie",
          label: "Umiestnenie",
          type: "select",
          required: true,
          defaultValue: "hlavicka",
          options: [
            { label: "Hlavička", value: "hlavicka" },
            { label: "Pätička", value: "paticka" },
            { label: "Vedľajšie", value: "vedlajsie" },
          ],
          admin: { width: "50%", description: "Podľa toho si ho web nájde." },
        },
      ],
    },
    {
      name: "polozky",
      label: "Položky menu",
      type: "array",
      labels: { singular: "Položka", plural: "Položky" },
      fields: [
        odkaz("Odkaz", "Kam položka vedie."),
        {
          name: "podpolozky",
          label: "Rozbaľovacie podpoložky",
          type: "array",
          labels: { singular: "Podpoložka", plural: "Podpoložky" },
          fields: [odkaz("Odkaz", "Kam podpoložka vedie.")],
        },
      ],
    },
  ],
  hooks: {
    beforeValidate: [overProjekt("spravca")],
    ...hookyObsahu,
  },
};
