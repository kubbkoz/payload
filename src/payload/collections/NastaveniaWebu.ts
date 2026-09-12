import type { CollectionConfig } from "payload";

import { citatObsah, filterAktivnehoProjektu, spravovatProjekt, vytvaratVProjekte } from "../access";
import { hookyObsahu } from "../hooky";
import { overProjekt, poleProjektu } from "../polia/projekt";
import { relaciaVProjekte } from "../polia/spolocne";

/**
 * Jeden riadok na projekt: logo, kontakt, otváracie hodiny, siete, meranie,
 * právne texty. Nový projekt si ho založí sám (hook v kolekcii Projekty),
 * takže správca nikdy nenarazí na prázdny zoznam a otázku, čo s ním.
 *
 * Jedinečnosť na projekt drží index — nie dohoda, že sa druhý riadok
 * nezaloží.
 */
export const NastaveniaWebu: CollectionConfig = {
  slug: "nastavenia-webu",
  labels: { singular: "Nastavenia webu", plural: "Nastavenia webov" },
  admin: {
    useAsTitle: "nazovWebu",
    defaultColumns: ["nazovWebu", "projekt", "updatedAt"],
    group: "Štruktúra webu",
    baseListFilter: filterAktivnehoProjektu,
    description: "Identita webu, kontakty, siete, meranie a právne texty.",
  },
  access: {
    read: citatObsah,
    create: vytvaratVProjekte,
    update: spravovatProjekt,
    delete: spravovatProjekt,
  },
  indexes: [{ fields: ["projekt"], unique: true }],
  fields: [
    poleProjektu("spravca"),
    {
      type: "tabs",
      tabs: [
        {
          label: "Identita",
          description: "Ako sa web predstavuje.",
          fields: [
            { name: "nazovWebu", label: "Názov webu", type: "text", required: true },
            {
              name: "podtitul",
              label: "Podtitul",
              type: "text",
              admin: { description: 'Krátko, napr. „Vináreň a wine bar v Trstenej“.' },
            },
            {
              name: "popisWebu",
              label: "Popis webu",
              type: "textarea",
              admin: { description: "Použije sa ako predvolený popis vo vyhľadávaní." },
            },
            relaciaVProjekte("media", { name: "logo", label: "Logo" }),
            relaciaVProjekte("media", { name: "favicon", label: "Favicon" }),
            relaciaVProjekte("media", {
              name: "obrazokZdielania",
              label: "Predvolený obrázok pri zdieľaní",
            }),
            {
              type: "row",
              fields: [
                {
                  name: "farbaHlavna",
                  label: "Hlavná farba",
                  type: "text",
                  admin: { width: "50%", description: "Hex, napr. #2f6f4e." },
                },
                {
                  name: "farbaDoplnkova",
                  label: "Doplnková farba",
                  type: "text",
                  admin: { width: "50%" },
                },
              ],
            },
          ],
        },
        {
          label: "Kontakt",
          fields: [
            {
              type: "row",
              fields: [
                { name: "email", label: "E-mail", type: "email", admin: { width: "50%" } },
                { name: "telefon", label: "Telefón", type: "text", admin: { width: "50%" } },
              ],
            },
            { name: "adresa", label: "Adresa", type: "textarea" },
            {
              name: "mapa",
              label: "Odkaz na mapu",
              type: "text",
              admin: { description: "Odkaz na Google Maps alebo embed adresa." },
            },
            {
              name: "hodiny",
              label: "Otváracie hodiny",
              type: "array",
              labels: { singular: "Riadok", plural: "Riadky" },
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "dni",
                      label: "Dni",
                      type: "text",
                      required: true,
                      admin: { width: "50%", description: "Napr. Pondelok – Štvrtok" },
                    },
                    {
                      name: "cas",
                      label: "Čas",
                      type: "text",
                      required: true,
                      admin: { width: "50%", description: "Napr. 16:00 – 22:00 alebo Zatvorené" },
                    },
                  ],
                },
              ],
            },
            {
              name: "firemneUdaje",
              label: "Firemné údaje",
              type: "group",
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "nazovFirmy", label: "Obchodné meno", type: "text", admin: { width: "50%" } },
                    { name: "ico", label: "IČO", type: "text", admin: { width: "25%" } },
                    { name: "dic", label: "DIČ / IČ DPH", type: "text", admin: { width: "25%" } },
                  ],
                },
                { name: "sidlo", label: "Sídlo", type: "textarea" },
              ],
            },
          ],
        },
        {
          label: "Siete a meranie",
          fields: [
            {
              name: "siete",
              label: "Sociálne siete",
              type: "array",
              labels: { singular: "Sieť", plural: "Siete" },
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "siet",
                      label: "Sieť",
                      type: "select",
                      required: true,
                      defaultValue: "instagram",
                      options: [
                        { label: "Instagram", value: "instagram" },
                        { label: "Facebook", value: "facebook" },
                        { label: "TikTok", value: "tiktok" },
                        { label: "YouTube", value: "youtube" },
                        { label: "LinkedIn", value: "linkedin" },
                        { label: "Iné", value: "ine" },
                      ],
                      admin: { width: "30%" },
                    },
                    {
                      name: "adresa",
                      label: "Adresa profilu",
                      type: "text",
                      required: true,
                      admin: { width: "70%" },
                    },
                  ],
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "analytics",
                  label: "Google Analytics / GTM ID",
                  type: "text",
                  admin: { width: "50%", description: "Napr. G-XXXXXXX alebo GTM-XXXXXX." },
                },
                {
                  name: "pixel",
                  label: "Meta Pixel ID",
                  type: "text",
                  admin: { width: "50%" },
                },
              ],
            },
          ],
        },
        {
          label: "Právne",
          description: "Texty, ktoré web musí mať, a lišta so súhlasom.",
          fields: [
            {
              name: "cookieLista",
              label: "Zobraziť lištu so súhlasom",
              type: "checkbox",
              defaultValue: true,
            },
            {
              name: "cookieText",
              label: "Text lišty",
              type: "textarea",
              admin: { description: "Prázdne = web použije vlastné predvolené znenie." },
            },
            { name: "ochranaUdajov", label: "Ochrana osobných údajov", type: "richText" },
            { name: "obchodnePodmienky", label: "Obchodné podmienky", type: "richText" },
          ],
        },
      ],
    },
  ],
  hooks: {
    beforeValidate: [overProjekt("spravca")],
    ...hookyObsahu,
  },
};
