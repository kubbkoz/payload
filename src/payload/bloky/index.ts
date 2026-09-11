import type { Block } from "payload";

import { relaciaVProjekte } from "../polia/spolocne";

/**
 * Stavebné bloky stránok.
 *
 * Zámerne ich je málo a sú hrubé. Skladačka z dvadsiatich mikro-blokov vyzerá
 * v ponuke bohato, ale obsluha v nej po týždni tápe a každý web z nej vyjde
 * inak rozbitý. Týchto dvanásť pokryje bežnú prezentáciu od hero po formulár;
 * čo sa nimi nedá, patrí do kódu napojeného webu, nie do CMS.
 *
 * Renderuje si ich cudzí web — hub ich vydá ako JSON cez delivery API.
 * Preto tu nie sú žiadne triedy ani farby: sú tu dáta a `varianta`, ktorú si
 * web preloží do svojho dizajnu.
 */

const tlacidla = {
  name: "tlacidla",
  label: "Tlačidlá",
  type: "array" as const,
  maxRows: 3,
  labels: { singular: "Tlačidlo", plural: "Tlačidlá" },
  fields: [
    {
      type: "row" as const,
      fields: [
        { name: "text", label: "Text", type: "text" as const, required: true, admin: { width: "40%" } },
        {
          name: "odkaz",
          label: "Odkaz",
          type: "text" as const,
          required: true,
          admin: { width: "40%", description: "Napr. /kontakt alebo https://…" },
        },
        {
          name: "styl",
          label: "Štýl",
          type: "select" as const,
          defaultValue: "hlavne",
          options: [
            { label: "Hlavné", value: "hlavne" },
            { label: "Vedľajšie", value: "vedlajsie" },
            { label: "Odkaz", value: "odkaz" },
          ],
          admin: { width: "20%" },
        },
      ],
    },
  ],
};

export const BlokHero: Block = {
  slug: "hero",
  interfaceName: "BlokHero",
  labels: { singular: "Hero", plural: "Hero" },
  admin: { group: "Úvod" },
  fields: [
    { name: "nadpis", label: "Nadpis", type: "text", required: true },
    { name: "podnadpis", label: "Podnadpis", type: "textarea" },
    relaciaVProjekte("media", { name: "pozadie", label: "Fotka na pozadí" }),
    {
      name: "varianta",
      label: "Podoba",
      type: "select",
      defaultValue: "plny",
      options: [
        { label: "Cez celú obrazovku", value: "plny" },
        { label: "Nižší pás", value: "pas" },
        { label: "Text vedľa fotky", value: "split" },
      ],
    },
    tlacidla,
  ],
};

export const BlokText: Block = {
  slug: "text",
  interfaceName: "BlokText",
  labels: { singular: "Text", plural: "Texty" },
  admin: { group: "Obsah" },
  fields: [
    { name: "nadpis", label: "Nadpis nad textom", type: "text" },
    { name: "obsah", label: "Text", type: "richText", required: true },
    {
      name: "sirka",
      label: "Šírka",
      type: "select",
      defaultValue: "uzka",
      options: [
        { label: "Úzka (dobre sa číta)", value: "uzka" },
        { label: "Široká", value: "siroka" },
      ],
    },
  ],
};

export const BlokObrazok: Block = {
  slug: "obrazok",
  interfaceName: "BlokObrazok",
  labels: { singular: "Obrázok", plural: "Obrázky" },
  admin: { group: "Obsah" },
  fields: [
    relaciaVProjekte("media", { name: "obrazok", label: "Obrázok", required: true }),
    { name: "popisok", label: "Popisok pod obrázkom", type: "text" },
    {
      name: "sirka",
      label: "Šírka",
      type: "select",
      defaultValue: "obsah",
      options: [
        { label: "Ako text", value: "obsah" },
        { label: "Cez celú šírku", value: "plna" },
      ],
    },
  ],
};

export const BlokGaleria: Block = {
  slug: "galeria",
  interfaceName: "BlokGaleria",
  labels: { singular: "Galéria", plural: "Galérie" },
  admin: { group: "Obsah" },
  fields: [
    { name: "nadpis", label: "Nadpis", type: "text" },
    relaciaVProjekte("media", {
      name: "fotky",
      label: "Fotky",
      hasMany: true,
      required: true,
    }),
    {
      name: "rozlozenie",
      label: "Rozloženie",
      type: "select",
      defaultValue: "mriezka",
      options: [
        { label: "Mriežka", value: "mriezka" },
        { label: "Vodorovný pás", value: "pas" },
        { label: "Mozaika", value: "mozaika" },
      ],
    },
  ],
};

export const BlokVypis: Block = {
  slug: "vypis",
  interfaceName: "BlokVypis",
  labels: { singular: "Výpis obsahu", plural: "Výpisy obsahu" },
  admin: {
    group: "Obsah",
  },
  fields: [
    { name: "nadpis", label: "Nadpis", type: "text" },
    {
      name: "zdroj",
      label: "Čo vypísať",
      type: "select",
      required: true,
      defaultValue: "prispevky",
      options: [
        { label: "Príspevky", value: "prispevky" },
        { label: "Katalóg", value: "katalog" },
        { label: "Udalosti", value: "udalosti" },
      ],
      admin: {
        description:
          "Blok si obsah dotiahne sám pri každom načítaní — nie je to zoznam, ktorý treba ručne dopĺňať.",
      },
    },
    relaciaVProjekte("kategorie", {
      name: "kategoria",
      label: "Iba z kategórie",
      admin: { description: "Prázdne = všetko." },
    }),
    {
      type: "row",
      fields: [
        {
          name: "pocet",
          label: "Koľko kusov",
          type: "number",
          defaultValue: 6,
          min: 1,
          max: 48,
          admin: { width: "50%" },
        },
        {
          name: "rozlozenie",
          label: "Rozloženie",
          type: "select",
          defaultValue: "karty",
          options: [
            { label: "Karty", value: "karty" },
            { label: "Zoznam", value: "zoznam" },
            { label: "Kolotoč", value: "kolotoc" },
          ],
          admin: { width: "50%" },
        },
      ],
    },
    { name: "odkazNaVsetko", label: "Odkaz na celý výpis", type: "text" },
  ],
};

export const BlokDlazdice: Block = {
  slug: "dlazdice",
  interfaceName: "BlokDlazdice",
  labels: { singular: "Dlaždice", plural: "Dlaždice" },
  admin: { group: "Obsah" },
  fields: [
    { name: "nadpis", label: "Nadpis", type: "text" },
    {
      name: "polozky",
      label: "Dlaždice",
      type: "array",
      minRows: 1,
      labels: { singular: "Dlaždica", plural: "Dlaždice" },
      fields: [
        { name: "nadpis", label: "Nadpis", type: "text", required: true },
        { name: "text", label: "Text", type: "textarea" },
        relaciaVProjekte("media", { name: "ikona", label: "Ikona alebo fotka" }),
        { name: "odkaz", label: "Odkaz", type: "text" },
      ],
    },
  ],
};

export const BlokCta: Block = {
  slug: "cta",
  interfaceName: "BlokCta",
  labels: { singular: "Výzva k akcii", plural: "Výzvy k akcii" },
  admin: { group: "Akcia" },
  fields: [
    { name: "nadpis", label: "Nadpis", type: "text", required: true },
    { name: "text", label: "Text", type: "textarea" },
    tlacidla,
    {
      name: "varianta",
      label: "Podoba",
      type: "select",
      defaultValue: "pas",
      options: [
        { label: "Farebný pás", value: "pas" },
        { label: "Karta", value: "karta" },
      ],
    },
  ],
};

export const BlokFaq: Block = {
  slug: "faq",
  interfaceName: "BlokFaq",
  labels: { singular: "Otázky a odpovede", plural: "Otázky a odpovede" },
  admin: { group: "Obsah" },
  fields: [
    { name: "nadpis", label: "Nadpis", type: "text" },
    {
      name: "otazky",
      label: "Otázky",
      type: "array",
      minRows: 1,
      labels: { singular: "Otázka", plural: "Otázky" },
      fields: [
        { name: "otazka", label: "Otázka", type: "text", required: true },
        { name: "odpoved", label: "Odpoveď", type: "textarea", required: true },
      ],
    },
  ],
};

export const BlokFormular: Block = {
  slug: "formular",
  interfaceName: "BlokFormular",
  labels: { singular: "Formulár", plural: "Formuláre" },
  admin: { group: "Akcia" },
  fields: [
    { name: "nadpis", label: "Nadpis nad formulárom", type: "text" },
    { name: "text", label: "Text nad formulárom", type: "textarea" },
    relaciaVProjekte("formulare", {
      name: "formular",
      label: "Ktorý formulár",
      required: true,
    }),
  ],
};

export const BlokVideo: Block = {
  slug: "video",
  interfaceName: "BlokVideo",
  labels: { singular: "Video", plural: "Videá" },
  admin: { group: "Obsah" },
  fields: [
    { name: "nadpis", label: "Nadpis", type: "text" },
    {
      name: "adresa",
      label: "Odkaz na video",
      type: "text",
      admin: { description: "YouTube, Vimeo alebo priamy odkaz na .mp4." },
    },
    relaciaVProjekte("subory", {
      name: "subor",
      label: "Alebo nahraté video",
      admin: { description: "Použije sa, keď je odkaz prázdny." },
    }),
    relaciaVProjekte("media", { name: "nahlad", label: "Náhľadová fotka" }),
  ],
};

export const BlokKod: Block = {
  slug: "kod",
  interfaceName: "BlokKod",
  labels: { singular: "Vložený kód", plural: "Vložené kódy" },
  admin: {
    group: "Pokročilé",
  },
  fields: [
    {
      name: "kod",
      label: "HTML / embed kód",
      type: "code",
      required: true,
      admin: {
        language: "html",
        description:
          "Rezervačný widget, mapa, prehrávač. Vkladaj len kód zo zdroja, ktorému veríš — beží na webe návštevníka.",
      },
    },
  ],
};

export const BlokOddelovac: Block = {
  slug: "oddelovac",
  interfaceName: "BlokOddelovac",
  labels: { singular: "Oddeľovač", plural: "Oddeľovače" },
  admin: { group: "Pokročilé" },
  fields: [
    {
      name: "velkost",
      label: "Veľkosť medzery",
      type: "select",
      defaultValue: "stredna",
      options: [
        { label: "Malá", value: "mala" },
        { label: "Stredná", value: "stredna" },
        { label: "Veľká", value: "velka" },
      ],
    },
    { name: "ciara", label: "Nakresliť čiaru", type: "checkbox", defaultValue: false },
  ],
};

export const VSETKY_BLOKY: Block[] = [
  BlokHero,
  BlokText,
  BlokObrazok,
  BlokGaleria,
  BlokVypis,
  BlokDlazdice,
  BlokCta,
  BlokFaq,
  BlokFormular,
  BlokVideo,
  BlokKod,
  BlokOddelovac,
];
