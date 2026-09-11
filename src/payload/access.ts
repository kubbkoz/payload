import type { Access, FieldAccess, PayloadRequest, Where } from "payload";

import { staci, type Rola } from "./roly";

/**
 * Celé viac-projektové oddelenie stojí na tomto súbore.
 *
 * Pravidlo je jedno a platí bez výnimky: každý obsahový záznam nesie pole
 * `projekt` a prístup k nemu sa nerozhoduje podľa toho, čo si používateľ
 * otvoril, ale podľa toho, aké projekty má v `pristupy`. Funkcie nižšie preto
 * nevracajú len true/false — vracajú `Where` filter, ktorý Payload pripojí ku
 * KAŽDÉMU dotazu vrátane REST, GraphQL a zoznamov v administrácii. Vďaka tomu
 * neexistuje cesta, ktorou by sa dal cudzí záznam prečítať alebo prepísať:
 * nie je to kontrola v UI, je to podmienka v SQL.
 *
 * Master stojí nad tým všetkým a filter nedostáva vôbec.
 */

export type IdZaznamu = number | string;

type Pristup = { projekt?: unknown; rola?: Rola | null };

type HubUser = {
  id: IdZaznamu;
  collection?: string;
  master?: boolean | null;
  aktivny?: boolean | null;
  pristupy?: Pristup[] | null;
  /** Len pri API klientoch — projekt, na ktorý je kľúč viazaný. */
  projekt?: unknown;
};

const akoUser = (u: unknown): HubUser | null =>
  u && typeof u === "object" ? (u as HubUser) : null;

/** Relácia príde raz ako číslo, raz ako celý dokument. Zaujíma nás id. */
export const idZo = (hodnota: unknown): IdZaznamu | null => {
  if (typeof hodnota === "number" || typeof hodnota === "string") return hodnota;
  if (hodnota && typeof hodnota === "object" && "id" in hodnota) {
    const id = (hodnota as { id?: unknown }).id;
    if (typeof id === "number" || typeof id === "string") return id;
  }
  return null;
};

export const jeMaster = (u: unknown): boolean => {
  const user = akoUser(u);
  return Boolean(user && user.collection === "users" && user.master);
};

export const jePrihlaseny = (u: unknown): boolean => Boolean(akoUser(u));

export const jeApiKlient = (u: unknown): boolean =>
  akoUser(u)?.collection === "api-klienti";

export const projektApiKlienta = (u: unknown): IdZaznamu | null =>
  jeApiKlient(u) ? idZo(akoUser(u)?.projekt) : null;

/**
 * Projekty, v ktorých má používateľ aspoň zadanú rolu.
 * Deaktivovaný účet nemá nikde nič — prihlásiť sa síce nemôže, ale token,
 * ktorý mu ostal v prehliadači, by inak dožil svoju platnosť.
 */
export const projektyPouzivatela = (
  u: unknown,
  aspon: Rola = "pozorovatel",
): IdZaznamu[] => {
  const user = akoUser(u);
  if (!user || user.collection !== "users") return [];
  if (user.aktivny === false) return [];

  const ids: IdZaznamu[] = [];
  for (const pristup of user.pristupy ?? []) {
    if (!staci(pristup?.rola, aspon)) continue;
    const id = idZo(pristup?.projekt);
    if (id !== null && !ids.some((x) => String(x) === String(id))) ids.push(id);
  }
  return ids;
};

export const rolaVProjekte = (u: unknown, projekt: unknown): Rola | null => {
  const user = akoUser(u);
  const hladany = idZo(projekt);
  if (!user || hladany === null) return null;
  for (const pristup of user.pristupy ?? []) {
    if (String(idZo(pristup?.projekt)) === String(hladany)) {
      return (pristup?.rola as Rola) ?? null;
    }
  }
  return null;
};

export const maVProjekte = (u: unknown, projekt: unknown, aspon: Rola): boolean =>
  jeMaster(u) || staci(rolaVProjekte(u, projekt), aspon);

/** Aspoň niekde správca — rozhoduje o tom, či vôbec vidí správu ľudí. */
export const jeNiekdeSpravca = (u: unknown): boolean =>
  jeMaster(u) || projektyPouzivatela(u, "spravca").length > 0;

const spoj = (klauzuly: Where[]): Where | false => {
  if (klauzuly.length === 0) return false;
  if (klauzuly.length === 1) return klauzuly[0]!;
  return { or: klauzuly };
};

/* ── Čítanie ──────────────────────────────────────────────────────────── */

/**
 * Číta každý, kto má k projektu čokoľvek. API klient číta výhradne projekt,
 * na ktorý je jeho kľúč vystavený — aj keby si adresu iného uhádol.
 */
export const citatObsah: Access = ({ req }) => {
  const u = req.user;
  if (!u) return false;
  if (jeMaster(u)) return true;

  const klient = projektApiKlienta(u);
  if (klient !== null) return { projekt: { equals: klient } };
  if (jeApiKlient(u)) return false;

  const ids = projektyPouzivatela(u, "pozorovatel");
  return ids.length ? { projekt: { in: ids } } : false;
};

/* ── Zápis ────────────────────────────────────────────────────────────── */

/**
 * Úprava a mazanie. Editor a vyššie siaha na všetko v projekte, autor
 * výhradne na to, čo sám založil — preto tá druhá vetva s `vytvoril`.
 * API kľúče sú zásadne len na čítanie: web si obsah ťahá, nezapisuje ho.
 */
export const menitObsah: Access = ({ req }) => {
  const u = req.user;
  if (!u || jeApiKlient(u)) return false;
  if (jeMaster(u)) return true;

  const plne = projektyPouzivatela(u, "editor");
  const vlastne = projektyPouzivatela(u, "autor").filter(
    (id) => !plne.some((x) => String(x) === String(id)),
  );

  const klauzuly: Where[] = [];
  if (plne.length) klauzuly.push({ projekt: { in: plne } });
  if (vlastne.length) {
    klauzuly.push({
      and: [{ projekt: { in: vlastne } }, { vytvoril: { equals: akoUser(u)!.id } }],
    });
  }
  return spoj(klauzuly);
};

/** Zakladať smie ktokoľvek od autora vyššie; do ktorého projektu, stráži hook. */
export const vytvaratObsah: Access = ({ req }) => {
  const u = req.user;
  if (!u || jeApiKlient(u)) return false;
  if (jeMaster(u)) return true;
  return projektyPouzivatela(u, "autor").length > 0;
};

/** Nastavenia webu, navigácia, presmerovania, kľúče — iba správca projektu. */
export const spravovatProjekt: Access = ({ req }) => {
  const u = req.user;
  if (!u || jeApiKlient(u)) return false;
  if (jeMaster(u)) return true;
  const ids = projektyPouzivatela(u, "spravca");
  return ids.length ? { projekt: { in: ids } } : false;
};

export const vytvaratVProjekte: Access = ({ req }) => {
  const u = req.user;
  if (!u || jeApiKlient(u)) return false;
  if (jeMaster(u)) return true;
  return projektyPouzivatela(u, "spravca").length > 0;
};

/** Prísne len master — zakladanie projektov, mazanie kľúčov, systémové veci. */
export const ibaMaster: Access = ({ req }) => jeMaster(req.user);

export const ibaMasterPole: FieldAccess = ({ req }) => jeMaster(req.user);

export const nikdy: Access = () => false;

/* ── Aktívny projekt ──────────────────────────────────────────────────── */

/**
 * Prepínač projektu v hlavičke administrácie zapisuje cookie `hub-projekt`.
 * Nie je to bezpečnostný prvok — je to zúženie výhľadu. Práva zostávajú tam,
 * kde boli: aj keby si niekto cookie prepísal na cudzí projekt, filtre vyššie
 * mu nič nevrátia.
 */
export const COOKIE_PROJEKTU = "hub-projekt";

export const aktivnyProjekt = (req: PayloadRequest | undefined): IdZaznamu | null => {
  const hlavicky = req?.headers as Headers | undefined;
  const raw = typeof hlavicky?.get === "function" ? hlavicky.get("cookie") : null;
  if (!raw) return null;

  const zhoda = new RegExp(`(?:^|;\\s*)${COOKIE_PROJEKTU}=([^;]*)`).exec(raw);
  if (!zhoda?.[1]) return null;

  const hodnota = decodeURIComponent(zhoda[1]);
  if (!hodnota || hodnota === "vsetky") return null;
  return /^\d+$/.test(hodnota) ? Number(hodnota) : hodnota;
};

/** Zoznamy v administrácii ukazujú len aktívny projekt, ak je zvolený. */
export const filterAktivnehoProjektu = ({
  req,
}: {
  req: PayloadRequest;
}): Where | null => {
  const projekt = aktivnyProjekt(req);
  if (projekt === null) return null;
  if (
    !jeMaster(req.user) &&
    !projektyPouzivatela(req.user).some((id) => String(id) === String(projekt))
  ) {
    return null;
  }
  return { projekt: { equals: projekt } };
};
