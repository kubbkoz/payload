"use client";

import { useDocumentInfo, useFormFields } from "@payloadcms/ui";
import { useCallback, useEffect, useState } from "react";

/**
 * Návod na napojenie, vygenerovaný pre konkrétny projekt.
 *
 * Existuje preto, že napojiť web nie je ťažké, ale skladať si zakaždým z hlavy
 * tri premenné a tvar adresy je presne ten druh drobnej práce, pri ktorej
 * vzniknú preklepy a stratí sa pol hodiny. Tu je to hotové a s kódom projektu
 * už vyplneným — vrátane toho, že sa mení hneď, ako kód prepíšeš, ešte pred
 * uložením.
 *
 * Nie je to len pre šablónu. Rovnaké tri premenné a rovnaké adresy platia pre
 * hocijaký existujúci web, React, Astro aj obyčajný PHP — backend nevie a
 * nepotrebuje vedieť, čo si na druhom konci.
 */

const Blok = ({ nadpis, kod, popis }: { nadpis: string; kod: string; popis?: string }) => {
  const [skopirovane, nastav] = useState(false);

  const kopiruj = async () => {
    try {
      await navigator.clipboard.writeText(kod);
      nastav(true);
      window.setTimeout(() => nastav(false), 1800);
    } catch {
      // Bez práva na schránku (staršie prehliadače, http) ostáva označenie myšou.
    }
  };

  return (
    <div className="napojenie__blok">
      <div className="napojenie__hlavicka">
        <span className="napojenie__nadpis">{nadpis}</span>
        <button type="button" className="napojenie__kopiruj" onClick={kopiruj}>
          {skopirovane ? "Skopírované" : "Kopírovať"}
        </button>
      </div>
      {popis ? <p className="napojenie__popis">{popis}</p> : null}
      <pre className="napojenie__kod">{kod}</pre>
    </div>
  );
};

type VercelProjekt = {
  id: string;
  nazov: string;
  framework: string | null;
  domena: string | null;
  repozitar: string | null;
  napojenyNa: string | null;
};

/**
 * Výber existujúceho webu na Verceli a jeho napojenie jedným tlačidlom.
 *
 * Toto je cesta pre weby, ktoré už žijú. Nezakladá nič — len tomu projektu
 * nastaví premenné, prečíta doménu, zapíše ju späť sem a spustí nasadenie,
 * aby sa premenné prejavili. Preto stačí jediný token a netreba prístup do
 * GitHubu, ktorý zakladanie nových webov vyžaduje.
 */
const VyberProjektu = ({ kod }: { kod: string }) => {
  const { id } = useDocumentInfo();
  const [stav, nastavStav] = useState<"nacitavam" | "pripravene" | "nedostupne">("nacitavam");
  const [dovod, nastavDovod] = useState<string | null>(null);
  const [projekty, nastavProjekty] = useState<VercelProjekt[]>([]);
  const [zvoleny, nastavZvoleny] = useState("");
  const [pracuje, nastavPracuje] = useState(false);
  const [vysledok, nastavVysledok] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    let zivy = true;
    fetch("/api/napojenie/vercel-projekty", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (!zivy) return;
        if (d?.dostupne) {
          nastavProjekty(d.projekty ?? []);
          nastavStav("pripravene");
        } else {
          nastavDovod(d?.dovod ?? "Zoznam projektov sa nepodarilo načítať.");
          nastavStav("nedostupne");
        }
      })
      .catch((chyba) => {
        if (!zivy) return;
        nastavDovod(String(chyba));
        nastavStav("nedostupne");
      });
    return () => {
      zivy = false;
    };
  }, []);

  const napoj = useCallback(async () => {
    if (!zvoleny || !id || pracuje) return;
    nastavPracuje(true);
    nastavVysledok(null);
    try {
      const odpoved = await fetch("/api/napojenie/napojit", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ projekt: id, vercelId: zvoleny }),
      });
      const telo = await odpoved.json().catch(() => ({}));
      nastavVysledok(
        odpoved.ok && telo?.ok
          ? { ok: true, text: telo.sprava ?? "Hotovo." }
          : { ok: false, text: telo?.chyba ?? "Napojenie zlyhalo." },
      );
    } catch (chyba) {
      nastavVysledok({ ok: false, text: String(chyba) });
    } finally {
      nastavPracuje(false);
    }
  }, [zvoleny, id, pracuje]);

  if (stav === "nacitavam") {
    return <p className="napojenie__popis">Načítavam projekty z Vercelu…</p>;
  }

  if (stav === "nedostupne") {
    return (
      <div className="napojenie__blok">
        <span className="napojenie__nadpis">Existujúci web na Verceli</span>
        <p className="napojenie__popis">{dovod}</p>
        <p className="napojenie__popis">
          Bez tokenu sa dá napojiť aj ručne — premenné nižšie vlož do projektu sám.
        </p>
      </div>
    );
  }

  return (
    <div className="napojenie__blok">
      <span className="napojenie__nadpis">Napojiť existujúci web</span>
      <p className="napojenie__popis">
        Vyber projekt na Verceli. Hub mu nastaví premenné, prečíta doménu, zapíše ju sem
        a spustí nasadenie — ručne nemusíš nič.
      </p>

      <div className="napojenie__vyber">
        <select
          className="napojenie__select"
          value={zvoleny}
          onChange={(e) => nastavZvoleny(e.target.value)}
          disabled={pracuje}
        >
          <option value="">— vyber projekt —</option>
          {projekty.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nazov}
              {p.domena ? ` · ${p.domena}` : ""}
              {p.napojenyNa ? ` · už napojený na ${p.napojenyNa}` : ""}
            </option>
          ))}
        </select>

        <button
          type="button"
          className="napojenie__akcia"
          onClick={napoj}
          disabled={!zvoleny || !id || pracuje}
        >
          {pracuje ? "Napájam…" : "Napojiť"}
        </button>
      </div>

      {!id ? (
        <p className="napojenie__popis">Projekt najprv ulož — bez neho nie je čo napájať.</p>
      ) : null}

      {zvoleny && projekty.find((p) => p.id === zvoleny)?.napojenyNa &&
      projekty.find((p) => p.id === zvoleny)?.napojenyNa !== kod ? (
        <p className="napojenie__varovanie">
          Pozor: tento web je napojený na projekt{" "}
          <strong>{projekty.find((p) => p.id === zvoleny)?.napojenyNa}</strong>. Napojením ho
          prepneš sem.
        </p>
      ) : null}

      {vysledok ? (
        <p className={vysledok.ok ? "napojenie__hotovo" : "napojenie__varovanie"}>
          {vysledok.text}
          {vysledok.ok ? " Obnov stránku, nech uvidíš zapísané hodnoty." : ""}
        </p>
      ) : null}
    </div>
  );
};

export const NavodNaNapojenie = () => {
  const kod = useFormFields(([fields]) => fields?.kod?.value) as string | undefined;
  const tajomstvo = useFormFields(([fields]) => fields?.revalidateSecret?.value) as
    | string
    | undefined;
  const verejne = useFormFields(([fields]) => fields?.verejneCitanie?.value) as
    | boolean
    | undefined;

  const hub = (process.env.NEXT_PUBLIC_SERVER_URL || "https://cms.zjav.sk").replace(/\/+$/, "");

  if (!kod) {
    return (
      <div className="napojenie">
        <p className="napojenie__prazdne">
          Vyplň <strong>Kód projektu</strong> a objaví sa tu hotové napojenie —
          premenné aj adresy s tvojím kódom.
        </p>
      </div>
    );
  }

  const premenne = [
    `HUB_PROJEKT=${kod}`,
    `HUB_URL=${hub}`,
    tajomstvo ? `HUB_SECRET=${tajomstvo}` : "# HUB_SECRET=<vyplň Tajomstvo pre prepláchnutie vyššie>",
    ...(verejne === false ? ["HUB_API_KEY=<vystav v Systém → API kľúče>"] : []),
  ].join("\n");

  const ukazka = [
    `const hub = "${hub}/api/web/${kod}";`,
    "",
    "// Nastavenia, menu a presmerovania naraz",
    "const web = await fetch(hub).then((r) => r.json());",
    "",
    "// Jedna stránka aj s blokmi",
    'const stranka = await fetch(`${hub}/stranka?cesta=/o-nas`).then((r) => r.json());',
    "",
    "// Výpisy",
    'const clanky = await fetch(`${hub}/prispevky?limit=6`).then((r) => r.json());',
  ].join("\n");

  return (
    <div className="napojenie">
      <p className="napojenie__uvod">
        Toto stačí hocijakému webu — šablóne, existujúcemu Next.js projektu aj cudziemu
        frameworku. Backend nepotrebuje vedieť, čo je na druhom konci.
      </p>

      <VyberProjektu kod={kod} />

      <Blok
        nadpis="Premenné prostredia"
        popis="Do Vercelu projektu webu (nie do tohto CMS)."
        kod={premenne}
      />

      <Blok
        nadpis="Adresy rozhrania"
        popis="Vracia výhradne zverejnený obsah tohto projektu."
        kod={ukazka}
      />

      <Blok
        nadpis="Preplach po zmene obsahu"
        popis="Endpoint na strane webu. Adresu naň vyplň vyššie do „Adresa na prepláchnutie webu“."
        kod={[
          "// app/api/revalidate/route.ts",
          'import { revalidateTag } from "next/cache";',
          "",
          "export async function POST(req: Request) {",
          '  if (req.headers.get("x-hub-secret") !== process.env.HUB_SECRET) {',
          '    return new Response("Nie", { status: 401 });',
          "  }",
          "  const { kolekcia } = await req.json();",
          '  revalidateTag("hub", "max");',
          '  if (kolekcia) revalidateTag(`hub:${kolekcia}`, "max");',
          "  return Response.json({ ok: true });",
          "}",
        ].join("\n")}
      />

      <p className="napojenie__poznamka">
        {verejne === false
          ? "Projekt má vypnuté verejné čítanie — každá požiadavka musí niesť hlavičku x-api-key."
          : "Projekt je verejný: obsah dostane ktokoľvek zo serveru aj z domén zapísaných vyššie. Z prehliadača iná doména neprejde."}
      </p>
    </div>
  );
};

export default NavodNaNapojenie;
