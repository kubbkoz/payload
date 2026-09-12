import "server-only";

import type {
  Formular,
  Kategoria,
  PolozkaKatalogu,
  Prispevok,
  Stranka,
  Udalost,
  Vypis,
  Zaklad,
} from "./typy";

/**
 * Jediné miesto, ktorým sa web rozpráva s hubom.
 *
 * Kľúčové je `server-only`: tento súbor sa nesmie dostať do prehliadača.
 * Berie so sebou API kľúč a keby ho niekto omylom naimportoval do klientskeho
 * komponentu, Next build spadne — čo je presne to správanie, aké chceme.
 * Formuláre preto chodia cez vlastný endpoint /api/formular, nie priamo.
 *
 * Cachovanie je na značkách. Každá odpoveď dostane značku `hub` a značku
 * svojej kolekcie; keď hub po uložení obsahu zavolá /api/revalidate, zhodí
 * sa presne tá jedna značka a zvyšok webu ostane vyrenderovaný.
 */

const ZAKLAD = (process.env.HUB_URL || "https://cms.zjav.sk").replace(/\/+$/, "");
const PROJEKT = process.env.HUB_PROJEKT || "";
const KLUC = process.env.HUB_API_KEY;

/** Ako dlho sa obsah drží, keď preplach z hubu nedorazí. */
const PLATNOST = 300;

export class ChybaHubu extends Error {}

const adresa = (cesta: string, parametre?: Record<string, string | number | undefined>) => {
  const url = new URL(`${ZAKLAD}/api/web/${PROJEKT}${cesta}`);
  for (const [kluc, hodnota] of Object.entries(parametre ?? {})) {
    if (hodnota !== undefined && hodnota !== null && hodnota !== "") {
      url.searchParams.set(kluc, String(hodnota));
    }
  }
  return url.toString();
};

async function citaj<T>(
  cesta: string,
  znacka: string,
  parametre?: Record<string, string | number | undefined>,
): Promise<T | null> {
  if (!PROJEKT) {
    throw new ChybaHubu(
      "Chýba premenná HUB_PROJEKT — bez kódu projektu web nevie, čí obsah má ťahať.",
    );
  }

  try {
    const odpoved = await fetch(adresa(cesta, parametre), {
      headers: KLUC ? { "x-api-key": KLUC } : undefined,
      next: { tags: ["hub", `hub:${znacka}`], revalidate: PLATNOST },
    });

    // 404 je bežná odpoveď (stránka neexistuje), nie porucha — vracia sa null
    // a routa z toho spraví riadnu 404 stránku.
    if (odpoved.status === 404) return null;

    if (!odpoved.ok) {
      const telo = await odpoved.text().catch(() => "");
      throw new ChybaHubu(`Hub odpovedal ${odpoved.status} na ${cesta}. ${telo.slice(0, 200)}`);
    }

    return (await odpoved.json()) as T;
  } catch (chyba) {
    if (chyba instanceof ChybaHubu) throw chyba;
    throw new ChybaHubu(`Hub je nedostupný (${cesta}): ${(chyba as Error).message}`);
  }
}

/** Nastavenia, menu a presmerovania naraz — beží v každom rozložení. */
export const zaklad = () => citaj<Zaklad>("", "zaklad");

export const stranka = (cesta: string) => citaj<Stranka>("/stranka", "stranky", { cesta });

export const zoznamStranok = () =>
  citaj<{ celkom: number; docs: { cesta: string; nazov: string; perex: string | null; upravene: string }[] }>(
    "/stranky",
    "stranky",
  );

type FiltreVypisu = {
  limit?: number;
  strana?: number;
  kategoria?: string;
  odporucane?: 1;
  radit?: string;
  vsetky?: 1;
};

export const prispevky = (filtre: FiltreVypisu = {}) =>
  citaj<Vypis<Prispevok>>("/prispevky", "prispevky", filtre);

export const katalog = (filtre: FiltreVypisu = {}) =>
  citaj<Vypis<PolozkaKatalogu>>("/katalog", "katalog", filtre);

export const udalosti = (filtre: FiltreVypisu = {}) =>
  citaj<Vypis<Udalost>>("/udalosti", "udalosti", filtre);

/** Detail sa ťahá tým istým výpisom so slugom — hub na to nemá zvláštnu cestu. */
const prvy = async <T>(vypis: Promise<Vypis<T> | null>): Promise<T | null> =>
  (await vypis)?.docs?.[0] ?? null;

export const prispevok = (slug: string) =>
  prvy(citaj<Vypis<Prispevok>>("/prispevky", "prispevky", { slug, limit: 1 }));

export const polozkaKatalogu = (slug: string) =>
  prvy(citaj<Vypis<PolozkaKatalogu>>("/katalog", "katalog", { slug, limit: 1 }));

export const udalost = (slug: string) =>
  prvy(citaj<Vypis<Udalost>>("/udalosti", "udalosti", { slug, limit: 1, vsetky: 1 }));

export const kategorie = (pre?: "prispevky" | "katalog" | "udalosti") =>
  citaj<{ docs: Kategoria[] }>("/kategorie", "kategorie", { pre });

export const formular = (slug: string) =>
  citaj<Formular>(`/formular/${encodeURIComponent(slug)}`, "formulare");

/** Odoslanie formulára. Beží na serveri, aby kľúč neopustil server. */
export async function odosliFormular(
  slug: string,
  hodnoty: Record<string, unknown>,
): Promise<{ stav: number; telo: unknown }> {
  const odpoved = await fetch(adresa(`/formular/${encodeURIComponent(slug)}`), {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(KLUC ? { "x-api-key": KLUC } : {}),
    },
    body: JSON.stringify(hodnoty),
    cache: "no-store",
  });
  return { stav: odpoved.status, telo: await odpoved.json().catch(() => ({})) };
}

export const kodProjektu = () => PROJEKT;
