import type { PayloadRequest } from "payload";

/**
 * Spoločná obsluha delivery API: kto sa pýta, smie sa pýtať, a odkiaľ.
 *
 * CORS sa tu nerobí hviezdičkou. Zoznam povolených pôvodov vzniká z domén
 * zapísaných pri projekte — cudzia stránka si teda obsah do prehliadača
 * nestiahne, aj keby adresu poznala. Serverové volania (bez hlavičky Origin)
 * tým obmedzené nie sú, tie rieši kľúč.
 */

export type Projekt = {
  id: number | string;
  kod: string;
  nazov: string;
  stav?: string | null;
  verejneCitanie?: boolean | null;
  domenaHlavna?: string | null;
  domeny?: { adresa?: string | null }[] | null;
};

const normalizuj = (adresa: string): string => {
  try {
    return new URL(adresa).origin.toLowerCase();
  } catch {
    return adresa.trim().replace(/\/+$/, "").toLowerCase();
  }
};

export const povolenePovody = (projekt: Projekt): string[] => {
  const zoznam = [
    projekt.domenaHlavna,
    ...(projekt.domeny ?? []).map((d) => d?.adresa),
  ].filter((x): x is string => typeof x === "string" && x.trim().length > 0);
  return [...new Set(zoznam.map(normalizuj))];
};

export const hlavickyCors = (projekt: Projekt, povod: string | null): HeadersInit => {
  const zakladne: Record<string, string> = {
    "content-type": "application/json; charset=utf-8",
    vary: "Origin",
  };
  if (!povod) return zakladne;

  const povolene = povolenePovody(projekt);
  if (!povolene.includes(normalizuj(povod))) return zakladne;

  return {
    ...zakladne,
    "access-control-allow-origin": povod,
    "access-control-allow-methods": "GET, POST, OPTIONS",
    "access-control-allow-headers": "content-type, x-api-key, authorization",
    "access-control-max-age": "86400",
  };
};

export const odpoved = (
  telo: unknown,
  projekt: Projekt | null,
  req: PayloadRequest,
  stav = 200,
  cache = "public, max-age=0, s-maxage=60, stale-while-revalidate=300",
): Response => {
  const povod = req.headers.get("origin");
  const hlavicky = projekt
    ? hlavickyCors(projekt, povod)
    : { "content-type": "application/json; charset=utf-8" };
  return new Response(JSON.stringify(telo), {
    status: stav,
    headers: { ...hlavicky, "cache-control": stav === 200 ? cache : "no-store" },
  });
};

export const chyba = (
  sprava: string,
  stav: number,
  req: PayloadRequest,
  projekt: Projekt | null = null,
): Response => odpoved({ chyba: sprava }, projekt, req, stav, "no-store");

/** Projekt podľa kódu z adresy. Pozastavený a archivovaný obsah nevydáva. */
export const najdiProjekt = async (
  req: PayloadRequest,
  kod: unknown,
): Promise<Projekt | null> => {
  if (typeof kod !== "string" || !kod.trim()) return null;
  const { docs } = await req.payload.find({
    collection: "projekty",
    where: { kod: { equals: kod.trim().toLowerCase() } },
    limit: 1,
    depth: 1,
    overrideAccess: true,
  });
  return (docs[0] as unknown as Projekt) ?? null;
};

/**
 * Smie táto požiadavka čítať obsah projektu?
 *
 * Buď je projekt označený ako verejný — vtedy stačí, že požiadavka prišla
 * z povolenej domény alebo zo servera —, alebo musí niesť kľúč vystavený
 * presne na tento projekt. Kľúč overuje Payload vlastnou stratégiou, tu sa
 * len prebalí hlavička, aby sa dalo posielať pohodlnejšie `x-api-key`.
 */
export const smieCitat = async (
  req: PayloadRequest,
  projekt: Projekt,
): Promise<{ ok: true } | { ok: false; dovod: string; stav: number }> => {
  if (projekt.stav === "pozastaveny" || projekt.stav === "archiv") {
    return { ok: false, dovod: "Projekt je pozastavený.", stav: 423 };
  }

  const kluc =
    req.headers.get("x-api-key") ??
    (req.headers.get("authorization")?.startsWith("Bearer ")
      ? req.headers.get("authorization")!.slice(7)
      : null);

  if (kluc) {
    try {
      // Kľúč overuje Payload vlastnou stratégiou — porovnáva šifrovaný zápis
      // v databáze, nie reťazec. Tu sa len prebalí hlavička, aby sa dalo
      // posielať pohodlnejšie `x-api-key` namiesto plného tvaru Authorization.
      const { user } = await req.payload.auth({
        headers: new Headers({ authorization: `api-klienti API-Key ${kluc}` }),
      });

      if (!user || user.collection !== "api-klienti") {
        return { ok: false, dovod: "Neplatný kľúč.", stav: 401 };
      }
      if ((user as { aktivny?: boolean }).aktivny === false) {
        return { ok: false, dovod: "Kľúč bol zneplatnený.", stav: 401 };
      }

      const klucovyProjekt = (user as { projekt?: unknown }).projekt;
      const idKluca =
        klucovyProjekt && typeof klucovyProjekt === "object" && "id" in klucovyProjekt
          ? (klucovyProjekt as { id?: unknown }).id
          : klucovyProjekt;

      if (String(idKluca ?? "") !== String(projekt.id)) {
        return { ok: false, dovod: "Kľúč nepatrí k tomuto projektu.", stav: 403 };
      }
      return { ok: true };
    } catch {
      return { ok: false, dovod: "Neplatný kľúč.", stav: 401 };
    }
  }

  if (projekt.verejneCitanie) {
    const povod = req.headers.get("origin");
    if (!povod) return { ok: true };
    if (povolenePovody(projekt).includes(normalizuj(povod))) return { ok: true };
    return { ok: false, dovod: "Táto doména nie je pri projekte povolená.", stav: 403 };
  }

  return { ok: false, dovod: "Chýba API kľúč.", stav: 401 };
};

export const cislo = (hodnota: unknown, predvolene: number, strop: number): number => {
  const n = Number(hodnota);
  if (!Number.isFinite(n) || n <= 0) return predvolene;
  return Math.min(Math.floor(n), strop);
};
