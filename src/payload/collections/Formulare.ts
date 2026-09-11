import type { CollectionConfig } from "payload";

import { citatObsah, filterAktivnehoProjektu, menitObsah, vytvaratObsah } from "../access";
import { hookyObsahu } from "../hooky";
import { overProjekt, poleProjektu } from "../polia/projekt";
import { poleSlug } from "../polia/spolocne";

/**
 * Skladateľné formuláre. Web dostane popis polí ako JSON a vykreslí si ich
 * vlastným dizajnom; späť pošle hodnoty na jeden endpoint. Hub validuje,
 * uloží a rozpošle e-maily.
 *
 * Kľúč poľa je to, čo príde v tele požiadavky — preto sa normalizuje na slug
 * a nie je na ňom voľná ruka. Ochrana proti robotom je vždy zapnutá a robí sa
 * skrytým poľom, nie captchou: captcha je ďalšia služba, ďalší kľúč a ďalšia
 * vec, ktorá sa pokazí, pri objeme, aký má bežná prezentácia.
 */
export const Formulare: CollectionConfig = {
  slug: "formulare",
  labels: { singular: "Formulár", plural: "Formuláre" },
  admin: {
    useAsTitle: "nazov",
    defaultColumns: ["nazov", "kod", "projekt", "updatedAt"],
    group: "Interakcia",
    baseListFilter: filterAktivnehoProjektu,
    description: "Kontaktné, rezervačné a dopytové formuláre webu.",
  },
  access: {
    read: citatObsah,
    create: vytvaratObsah,
    update: menitObsah,
    delete: menitObsah,
  },
  indexes: [{ fields: ["projekt", "slug"], unique: true }],
  fields: [
    poleProjektu(),
    { name: "nazov", label: "Názov formulára", type: "text", required: true },
    poleSlug(),
    {
      name: "polia",
      label: "Polia formulára",
      type: "array",
      minRows: 1,
      labels: { singular: "Pole", plural: "Polia" },
      admin: { description: "Poradie tu je poradím na webe." },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "popis",
              label: "Popis nad poľom",
              type: "text",
              required: true,
              admin: { width: "40%", description: 'Čo do neho človek napíše, napr. „Tvoje meno“.' },
            },
            {
              name: "kluc",
              label: "Kľúč",
              type: "text",
              required: true,
              admin: {
                width: "30%",
                description: "Pod týmto názvom hodnota príde a uloží sa. Bez diakritiky.",
              },
              hooks: {
                beforeValidate: [
                  ({ value, siblingData }) => {
                    const zdroj =
                      (typeof value === "string" && value.trim()) ||
                      (siblingData as { popis?: string })?.popis ||
                      "";
                    return zdroj
                      .normalize("NFD")
                      .replace(/[\u0300-\u036f]/g, "")
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "_")
                      .replace(/^_+|_+$/g, "")
                      .slice(0, 60);
                  },
                ],
              },
            },
            {
              name: "typ",
              label: "Typ",
              type: "select",
              required: true,
              defaultValue: "text",
              options: [
                { label: "Text", value: "text" },
                { label: "Dlhý text", value: "textarea" },
                { label: "E-mail", value: "email" },
                { label: "Telefón", value: "tel" },
                { label: "Číslo", value: "cislo" },
                { label: "Dátum", value: "datum" },
                { label: "Výber z možností", value: "vyber" },
                { label: "Zaškrtávacie políčko", value: "zaskrtnutie" },
                { label: "Súhlas so spracovaním údajov", value: "suhlas" },
              ],
              admin: { width: "30%" },
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "povinne",
              label: "Povinné",
              type: "checkbox",
              defaultValue: false,
              admin: { width: "30%" },
            },
            {
              name: "napoveda",
              label: "Nápoveda pod poľom",
              type: "text",
              admin: { width: "70%" },
            },
          ],
        },
        {
          name: "moznosti",
          label: "Možnosti",
          type: "array",
          labels: { singular: "Možnosť", plural: "Možnosti" },
          admin: { condition: (_d, siblingData) => siblingData?.typ === "vyber" },
          fields: [{ name: "hodnota", label: "Možnosť", type: "text", required: true }],
        },
      ],
    },
    {
      type: "collapsible",
      label: "Po odoslaní",
      fields: [
        {
          name: "textTlacidla",
          label: "Text tlačidla",
          type: "text",
          defaultValue: "Odoslať",
        },
        {
          name: "spravaPoOdoslani",
          label: "Správa po odoslaní",
          type: "textarea",
          defaultValue: "Ďakujeme, ozveme sa čo najskôr.",
        },
        {
          name: "presmerovanie",
          label: "Alebo presmerovať na adresu",
          type: "text",
          admin: { description: "Keď je vyplnené, správa sa nezobrazí." },
        },
      ],
    },
    {
      type: "collapsible",
      label: "E-maily",
      admin: {
        description:
          "Bez nastaveného odosielateľa sa e-maily nepošlú — odpoveď sa aj tak uloží.",
      },
      fields: [
        {
          name: "prijemcovia",
          label: "Komu poslať upozornenie",
          type: "array",
          labels: { singular: "Adresa", plural: "Adresy" },
          fields: [{ name: "email", label: "E-mail", type: "email", required: true }],
        },
        {
          name: "predmet",
          label: "Predmet upozornenia",
          type: "text",
          admin: { description: "Prázdne = „Nová odpoveď z formulára <názov>“." },
        },
        {
          name: "potvrdenieOdosielatelovi",
          label: "Poslať potvrdenie tomu, kto formulár vyplnil",
          type: "checkbox",
          defaultValue: false,
          admin: { description: "Použije sa prvé pole typu E-mail." },
        },
        {
          name: "textPotvrdenia",
          label: "Text potvrdenia",
          type: "textarea",
          admin: { condition: (_d, s) => Boolean(s?.potvrdenieOdosielatelovi) },
        },
      ],
    },
  ],
  hooks: {
    beforeValidate: [overProjekt()],
    ...hookyObsahu,
  },
};
