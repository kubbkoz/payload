"use client";

import { useFormFields } from "@payloadcms/ui";
import { useState } from "react";

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
