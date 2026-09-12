/**
 * Jediný zoznam kolekcií, ktoré patria projektu.
 *
 * Číta ho kaskádové mazanie projektu, nástenka aj delivery API. Keď pribudne
 * nová obsahová kolekcia, dopĺňa sa na jednom mieste — inak sa skôr či neskôr
 * stane, že zmazaný projekt po sebe nechá riadky, ktoré už nikto neuvidí,
 * ale v databáze zaberajú a v exportoch strašia.
 */
export const KOLEKCIE_PROJEKTU = [
  "stranky",
  "prispevky",
  "kategorie",
  "katalog",
  "udalosti",
  "media",
  "subory",
  "navigacia",
  "formulare",
  "odpovede",
  "presmerovania",
  "nastavenia-webu",
  "zaznamy",
] as const;

export type KolekciaProjektu = (typeof KOLEKCIE_PROJEKTU)[number];

/** Kolekcie, ktoré vidí nástenka ako „koľko čoho web má“. */
export const PREHLAD_NA_NASTENKE: { slug: KolekciaProjektu; popis: string }[] = [
  { slug: "stranky", popis: "Stránky" },
  { slug: "prispevky", popis: "Príspevky" },
  { slug: "katalog", popis: "Položky katalógu" },
  { slug: "udalosti", popis: "Udalosti" },
  { slug: "media", popis: "Fotografie" },
  { slug: "odpovede", popis: "Odpovede z formulárov" },
];
