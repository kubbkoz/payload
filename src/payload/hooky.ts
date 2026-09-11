import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  PayloadRequest,
  RequiredDataFromCollectionSlug,
} from "payload";

import { idZo } from "./access";

/**
 * Dve veci, ktoré sa majú stať po každej zmene obsahu: napojený web sa má
 * dozvedieť, že má zahodiť vyrenderovanú kópiu, a v systéme má ostať stopa,
 * kto čo kedy urobil.
 *
 * Obe sú zámerne „ticho zlyhávajúce“. Keď je cudzí web dole alebo zapísanie
 * záznamu neprejde, uloženie obsahu sa tým nesmie zvaliť — obsluha nemá čo
 * robiť s chybou cudzieho servera uprostred písania článku.
 */

const jeAutosave = (req?: PayloadRequest): boolean => {
  const q = req?.query as Record<string, unknown> | undefined;
  return q?.autosave === true || q?.autosave === "true";
};

type Projekt = {
  id: number | string;
  stav?: string | null;
  revalidateUrl?: string | null;
  revalidateSecret?: string | null;
};

const nacitajProjekt = async (
  req: PayloadRequest,
  hodnota: unknown,
): Promise<Projekt | null> => {
  const id = idZo(hodnota);
  if (id === null) return null;
  if (hodnota && typeof hodnota === "object" && "revalidateUrl" in hodnota) {
    return hodnota as Projekt;
  }
  try {
    return (await req.payload.findByID({
      collection: "projekty",
      id,
      depth: 0,
      overrideAccess: true,
    })) as unknown as Projekt;
  } catch {
    return null;
  }
};

/**
 * Preplach napojeného webu.
 *
 * Hub nevie, aké adresy cudzí web má — a ani vedieť nemá. Pošle preto jedno
 * oznámenie „v projekte X sa zmenila kolekcia Y, záznam Z“ a čo s tým web
 * urobí, je jeho vec: väčšinou `revalidateTag` alebo `revalidatePath`.
 * Pätsekundový strop je tam preto, aby pomalý web nedržal ukladanie obsahu.
 */
const oznam = async (
  req: PayloadRequest,
  projekt: Projekt | null,
  telo: Record<string, unknown>,
): Promise<void> => {
  if (!projekt?.revalidateUrl) return;
  if (projekt.stav === "archiv") return;

  try {
    const odpoved = await fetch(projekt.revalidateUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(projekt.revalidateSecret ? { "x-hub-secret": projekt.revalidateSecret } : {}),
      },
      body: JSON.stringify(telo),
      signal: AbortSignal.timeout(5000),
    });
    if (!odpoved.ok) {
      req.payload.logger.warn(
        { stav: odpoved.status, url: projekt.revalidateUrl },
        "Web odmietol oznámenie o zmene obsahu.",
      );
    }
  } catch (chyba) {
    req.payload.logger.warn({ chyba }, "Oznámenie o zmene obsahu sa nepodarilo doručiť.");
  }
};

export const preplachPoZmene: CollectionAfterChangeHook = async ({
  doc,
  req,
  collection,
  context,
  operation,
}) => {
  if (context?.preskocPreplach || jeAutosave(req)) return doc;
  const projekt = await nacitajProjekt(req, (doc as { projekt?: unknown })?.projekt);
  await oznam(req, projekt, {
    udalost: operation === "create" ? "vytvorene" : "zmenene",
    projekt: projekt?.id ?? null,
    kolekcia: collection.slug,
    zaznam: (doc as { id?: unknown })?.id ?? null,
    cas: new Date().toISOString(),
  });
  return doc;
};

export const preplachPoZmazani: CollectionAfterDeleteHook = async ({
  doc,
  req,
  collection,
  context,
}) => {
  if (context?.preskocPreplach) return doc;
  const projekt = await nacitajProjekt(req, (doc as { projekt?: unknown })?.projekt);
  await oznam(req, projekt, {
    udalost: "zmazane",
    projekt: projekt?.id ?? null,
    kolekcia: collection.slug,
    zaznam: (doc as { id?: unknown })?.id ?? null,
    cas: new Date().toISOString(),
  });
  return doc;
};

/* ── Záznam činnosti ──────────────────────────────────────────────────── */

const nazovZaznamu = (doc: unknown): string => {
  const d = doc as Record<string, unknown> | undefined;
  for (const kluc of ["nazov", "title", "meno", "email", "popis", "cesta", "slug"]) {
    const v = d?.[kluc];
    if (typeof v === "string" && v.trim()) return v.slice(0, 160);
  }
  return `#${String(d?.id ?? "?")}`;
};

const zapis = async (
  req: PayloadRequest,
  data: Record<string, unknown>,
): Promise<void> => {
  try {
    await req.payload.create({
      collection: "zaznamy",
      data: data as RequiredDataFromCollectionSlug<"zaznamy">,
      overrideAccess: true,
      context: { preskocKontrolu: true, preskocPreplach: true },
    });
  } catch (chyba) {
    req.payload.logger.error({ chyba }, "Nepodarilo sa zapísať záznam činnosti.");
  }
};

export const zapisCinnost: CollectionAfterChangeHook = async ({
  doc,
  req,
  collection,
  operation,
  context,
}) => {
  if (context?.preskocZaznam || jeAutosave(req)) return doc;
  const projekt = idZo((doc as { projekt?: unknown })?.projekt);
  if (projekt === null) return doc;

  const stav = (doc as { _status?: string })?._status;
  await zapis(req, {
    projekt,
    kolekcia: collection.slug,
    zaznamId: String((doc as { id?: unknown })?.id ?? ""),
    nazov: nazovZaznamu(doc),
    akcia:
      operation === "create" ? "vytvorenie" : stav === "published" ? "zverejnenie" : "uprava",
    kto: req.user?.collection === "users" ? req.user.id : undefined,
    ktoPopis:
      req.user?.collection === "users"
        ? ((req.user as { meno?: string; email?: string }).meno ??
          (req.user as { email?: string }).email ??
          "")
        : "systém",
  });
  return doc;
};

export const zapisZmazanie: CollectionAfterDeleteHook = async ({
  doc,
  req,
  collection,
  context,
}) => {
  if (context?.preskocZaznam) return doc;
  const projekt = idZo((doc as { projekt?: unknown })?.projekt);
  if (projekt === null) return doc;

  await zapis(req, {
    projekt,
    kolekcia: collection.slug,
    zaznamId: String((doc as { id?: unknown })?.id ?? ""),
    nazov: nazovZaznamu(doc),
    akcia: "zmazanie",
    kto: req.user?.collection === "users" ? req.user.id : undefined,
    ktoPopis:
      req.user?.collection === "users"
        ? ((req.user as { meno?: string; email?: string }).meno ??
          (req.user as { email?: string }).email ??
          "")
        : "systém",
  });
  return doc;
};

/** Jeden riadok do každej obsahovej kolekcie — preplach webu aj stopa v systéme. */
export const hookyObsahu = {
  afterChange: [preplachPoZmene, zapisCinnost],
  afterDelete: [preplachPoZmazani, zapisZmazanie],
};
