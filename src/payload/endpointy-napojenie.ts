import { randomBytes } from "crypto";

import type { Endpoint } from "payload";

import { jeMaster } from "./access";
import {
  detailProjektu,
  domenyProjektu,
  nastavPremenne,
  spustiNasadenie,
  tokenVercelu,
  zoznamProjektov,
} from "./vercel";

/**
 * Napojenie existujúceho webu na hub priamo z administrácie.
 *
 * Zakladanie nového webu zo šablóny potrebuje prístup do GitHubu. Toto nie —
 * beží to len nad Vercel API, a preto sa tým dá začať skôr: účet už weby má,
 * len o hube zatiaľ nevedia.
 *
 * Endpointy sú prísne pre mastera. Nastavovať cudziemu projektu premenné je
 * zásah do infraštruktúry, nie do obsahu, a nemá to byť v rukách nikoho, kto
 * spravuje texty.
 */

const json = (telo: unknown, stav = 200): Response =>
  new Response(JSON.stringify(telo), {
    status: stav,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });

/** Vlastná doména má prednosť pred pridelenou *.vercel.app. */
const najlepsiaDomena = (domeny: string[]): string | null =>
  domeny.find((d) => !d.endsWith(".vercel.app")) ?? domeny[0] ?? null;

const zoznam: Endpoint = {
  path: "/napojenie/vercel-projekty",
  method: "get",
  handler: async (req) => {
    if (!jeMaster(req.user)) return json({ chyba: "Len pre mastera." }, 403);

    if (!tokenVercelu()) {
      return json({
        dostupne: false,
        dovod:
          "Chýba premenná VERCEL_TOKEN. Doplň ju v nastaveniach tohto projektu na Verceli a nasaď znova.",
        projekty: [],
      });
    }

    try {
      return json({ dostupne: true, projekty: await zoznamProjektov() });
    } catch (chyba) {
      return json({ dostupne: false, dovod: (chyba as Error).message, projekty: [] }, 502);
    }
  },
};

const napojit: Endpoint = {
  path: "/napojenie/napojit",
  method: "post",
  handler: async (req) => {
    if (!jeMaster(req.user)) return json({ chyba: "Len pre mastera." }, 403);
    if (!tokenVercelu()) return json({ chyba: "Chýba premenná VERCEL_TOKEN." }, 400);

    let telo: { projekt?: string | number; vercelId?: string };
    try {
      telo = ((await req.json?.()) ?? {}) as typeof telo;
    } catch {
      return json({ chyba: "Neplatné telo požiadavky." }, 400);
    }
    if (!telo.projekt || !telo.vercelId) {
      return json({ chyba: "Chýba projekt alebo vercelId." }, 400);
    }

    const kroky: string[] = [];

    try {
      const projekt = (await req.payload.findByID({
        collection: "projekty",
        id: telo.projekt,
        depth: 0,
        overrideAccess: true,
      })) as unknown as {
        id: number | string;
        kod: string;
        nazov: string;
        revalidateSecret?: string | null;
      };

      // Bez tajomstva by web nemal čím overiť, že preplach prišiel z hubu.
      const tajomstvo = projekt.revalidateSecret || randomBytes(24).toString("hex");
      const hub = (process.env.NEXT_PUBLIC_SERVER_URL || "https://cms.zjav.sk").replace(/\/+$/, "");

      const vercel = await detailProjektu(telo.vercelId);
      const domeny = await domenyProjektu(telo.vercelId).catch(() => []);
      const domena = najlepsiaDomena(domeny);
      const adresa = domena ? `https://${domena}` : null;

      await nastavPremenne(telo.vercelId, [
        { key: "HUB_PROJEKT", value: projekt.kod },
        { key: "HUB_URL", value: hub },
        { key: "HUB_SECRET", value: tajomstvo },
        ...(adresa ? [{ key: "NEXT_PUBLIC_WEB_URL", value: adresa }] : []),
      ]);
      kroky.push(`premenné nastavené v projekte ${vercel.name}`);

      await req.payload.update({
        collection: "projekty",
        id: projekt.id,
        data: {
          revalidateSecret: tajomstvo,
          ...(adresa
            ? { domenaHlavna: adresa, revalidateUrl: `${adresa}/api/revalidate` }
            : {}),
        },
        overrideAccess: true,
        context: { preskocKontrolu: true, preskocNasadenie: true, preskocPreplach: true },
      });
      kroky.push(adresa ? `adresa ${adresa} zapísaná do projektu` : "projekt bez domény");

      // Premenná sa prejaví až ďalším buildom. Bez toho by napojenie vyzeralo
      // hotovo a web by ďalej ukazoval starý obsah.
      let nasadenie: string | null = null;
      try {
        nasadenie = await spustiNasadenie(vercel);
        kroky.push(nasadenie ? "nasadenie spustené" : "projekt nie je napojený na git — nasaď ho ručne");
      } catch (chybaNasadenia) {
        kroky.push(`nasadenie sa nespustilo (${(chybaNasadenia as Error).message})`);
      }

      return json({
        ok: true,
        adresa,
        nasadenie,
        sprava: `${kroky.join(", ")}.`,
      });
    } catch (chyba) {
      req.payload.logger.error({ chyba }, "Napojenie existujúceho Vercel projektu zlyhalo.");
      return json(
        {
          ok: false,
          chyba: `${kroky.length ? `Podarilo sa: ${kroky.join(", ")}. ` : ""}Zlyhalo na: ${(chyba as Error).message}`,
        },
        502,
      );
    }
  },
};

export const ENDPOINTY_NAPOJENIA: Endpoint[] = [zoznam, napojit];
