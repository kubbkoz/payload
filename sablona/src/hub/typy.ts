/**
 * Tvar dát, ktoré vydáva delivery API hubu (/api/web/<kód>/…).
 *
 * Je to zámerne ručne písaný zrkadlový typ, nie generovaný: hub vydáva
 * o dosť menej, než má v databáze, a web nemá dôvod poznať jeho vnútornosti.
 * Keď sa API zmení, zmení sa tento súbor — a TypeScript ukáže presne tie
 * miesta, ktoré na to doplácajú.
 */

export type Obrazok = {
  url: string;
  alt: string;
  popisok: string | null;
  sirka: number | null;
  vyska: number | null;
  rezy: Record<string, { url: string; sirka?: number; vyska?: number }>;
};

export type Seo = {
  titulok: string | null;
  popis: string | null;
  obrazok: Obrazok | null;
  neindexovat: boolean;
};

/** Lexical JSON. Renderuje ho `hub/richtext.tsx`. */
export type BohatyText = { root?: { children?: unknown[] } } | null;

export type Tlacidlo = {
  text: string;
  odkaz: string;
  styl?: "hlavne" | "vedlajsie" | "odkaz" | null;
};

export type Blok =
  | { blockType: "hero"; id?: string; nadpis: string; podnadpis?: string | null; pozadie?: Obrazok | null; varianta?: "plny" | "pas" | "split" | null; tlacidla?: Tlacidlo[] | null }
  | { blockType: "text"; id?: string; nadpis?: string | null; obsah: BohatyText; sirka?: "uzka" | "siroka" | null }
  | { blockType: "obrazok"; id?: string; obrazok: Obrazok | null; popisok?: string | null; sirka?: "obsah" | "plna" | null }
  | { blockType: "galeria"; id?: string; nadpis?: string | null; fotky?: Obrazok[] | null; rozlozenie?: "mriezka" | "pas" | "mozaika" | null }
  | { blockType: "vypis"; id?: string; nadpis?: string | null; zdroj: "prispevky" | "katalog" | "udalosti"; kategoria?: { slug: string } | string | null; pocet?: number | null; rozlozenie?: "karty" | "zoznam" | "kolotoc" | null; odkazNaVsetko?: string | null }
  | { blockType: "dlazdice"; id?: string; nadpis?: string | null; polozky?: { nadpis: string; text?: string | null; ikona?: Obrazok | null; odkaz?: string | null }[] | null }
  | { blockType: "cta"; id?: string; nadpis: string; text?: string | null; tlacidla?: Tlacidlo[] | null; varianta?: "pas" | "karta" | null }
  | { blockType: "faq"; id?: string; nadpis?: string | null; otazky?: { otazka: string; odpoved: string }[] | null }
  | { blockType: "formular"; id?: string; nadpis?: string | null; text?: string | null; formular: { slug: string } | string | null }
  | { blockType: "video"; id?: string; nadpis?: string | null; adresa?: string | null; subor?: { url: string } | null; nahlad?: Obrazok | null }
  | { blockType: "kod"; id?: string; kod: string }
  | { blockType: "oddelovac"; id?: string; velkost?: "mala" | "stredna" | "velka" | null; ciara?: boolean | null };

export type PolozkaMenu = {
  text: string;
  typ: "stranka" | "adresa";
  novaKarta?: boolean | null;
  stranka?: { cesta: string } | null;
  adresa?: string | null;
  podpolozky?: PolozkaMenu[] | null;
};

export type Menu = {
  nazov: string;
  umiestnenie: "hlavicka" | "paticka" | "vedlajsie";
  polozky: PolozkaMenu[];
};

export type Nastavenia = {
  nazovWebu: string;
  podtitul: string | null;
  popisWebu: string | null;
  logo: Obrazok | null;
  favicon: Obrazok | null;
  obrazokZdielania: Obrazok | null;
  farby: { hlavna: string | null; doplnkova: string | null };
  kontakt: {
    email: string | null;
    telefon: string | null;
    adresa: string | null;
    mapa: string | null;
    hodiny: { dni: string; cas: string }[];
  };
  firemneUdaje: { nazovFirmy?: string | null; ico?: string | null; dic?: string | null; sidlo?: string | null } | null;
  siete: { siet: string; adresa: string }[];
  meranie: { analytics: string | null; pixel: string | null };
  pravne: {
    cookieLista: boolean;
    cookieText: string | null;
    ochranaUdajov: BohatyText;
    obchodnePodmienky: BohatyText;
  };
};

export type Zaklad = {
  projekt: { kod: string; nazov: string; stav: string | null };
  nastavenia: Nastavenia;
  menu: Menu[];
  presmerovania: { zo: string; na: string; kod: number }[];
};

export type Stranka = {
  cesta: string;
  nazov: string;
  perex: string | null;
  bloky: Blok[];
  seo: Seo;
  upravene: string;
};

type Spolocne = {
  id: number | string;
  slug: string;
  nazov: string;
  perex: string | null;
  obrazok: Obrazok | null;
  seo: Seo;
  upravene: string;
};

export type Prispevok = Spolocne & {
  datum: string | null;
  autor: string | null;
  odporucany: boolean;
  kategorie: { slug: string; nazov: string }[];
  obsah: BohatyText;
  bloky: Blok[];
};

export type PolozkaKatalogu = Spolocne & {
  cena: string | null;
  cenaCislo: number | null;
  jednotka: string | null;
  dostupne: boolean;
  odporucane: boolean;
  poradie: number;
  kategoria: { slug: string; nazov: string } | null;
  galeria: Obrazok[];
  vlastnosti: { nazov: string; hodnota: string }[];
  popis: BohatyText;
};

export type Udalost = Spolocne & {
  datum: string | null;
  cas: string | null;
  terminText: string | null;
  miesto: string | null;
  vstupne: string | null;
  odkazNaVstupenky: string | null;
  odporucana: boolean;
  kategoria: { slug: string; nazov: string } | null;
  popis: BohatyText;
};

export type Vypis<T> = { celkom: number; strana: number; stran: number; docs: T[] };

export type Kategoria = { slug: string; nazov: string; popis: string | null; pre: string[] };

export type PoleFormulara = {
  kluc: string;
  popis: string;
  typ: "text" | "textarea" | "email" | "tel" | "cislo" | "datum" | "vyber" | "zaskrtnutie" | "suhlas";
  povinne: boolean;
  napoveda: string | null;
  moznosti: string[];
};

export type Formular = {
  slug: string;
  nazov: string;
  polia: PoleFormulara[];
  textTlacidla: string;
  spravaPoOdoslani: string | null;
  presmerovanie: string | null;
};
