import { randomBytes } from "crypto";

import type { PayloadRequest } from "payload";

/**
 * Založenie webu z predvolenej šablóny pri vzniku projektu.
 *
 * Urobí tri veci: z template repozitára vyrobí nový repozitár, na Verceli
 * založí projekt napojený na neho s vyplnenými premennými a spustí prvé
 * nasadenie. Výsledok (adresy aj prípadnú chybu) zapíše späť do projektu, aby
 * to bolo vidieť v paneli — hook, ktorý zlyhá do serverless logu, je hook,
 * o ktorom sa nikto nikdy nedozvie.
 *
 * Bez tokenov v prostredí je celý mechanizmus vypnutý a projekt sa založí ako
 * predtým. To je zámer: prístup, ktorý smie zakladať repozitáre, nemá v systéme
 * ležať „pre istotu".
 *
 * Nikdy nevyhadzuje výnimku. Zlyhané nasadenie nesmie zhodiť založenie
 * projektu — obsah je dôležitejší než automatika okolo neho.
 */

type Nastavenie = {
  githubToken: string;
  sablonaVlastnik: string;
  sablonaRepo: string;
  cieloryVlastnik: string;
  vercelToken: string;
  vercelTim?: string;
  hubUrl: string;
};

export const nastavenieNasadenia = (): Nastavenie | null => {
  const githubToken = process.env.GITHUB_TOKEN;
  const sablona = process.env.SABLONA_REPO; // napr. "kubbkoz/zjav-web"
  const vercelToken = process.env.VERCEL_TOKEN;
  if (!githubToken || !sablona || !vercelToken) return null;

  const [sablonaVlastnik, sablonaRepo] = sablona.split("/");
  if (!sablonaVlastnik || !sablonaRepo) return null;

  return {
    githubToken,
    sablonaVlastnik,
    sablonaRepo,
    cieloryVlastnik: process.env.GITHUB_OWNER || sablonaVlastnik,
    vercelToken,
    vercelTim: process.env.VERCEL_TEAM_ID,
    hubUrl: process.env.NEXT_PUBLIC_SERVER_URL || "https://cms.zjav.sk",
  };
};

const STROP = 15000;

const posli = async (url: string, moznosti: RequestInit): Promise<any> => {
  const odpoved = await fetch(url, { ...moznosti, signal: AbortSignal.timeout(STROP) });
  const telo = await odpoved.json().catch(() => ({}));
  if (!odpoved.ok) {
    const dovod = telo?.error?.message || telo?.message || JSON.stringify(telo).slice(0, 200);
    throw new Error(`${odpoved.status} ${url.replace(/\?.*/, "")} — ${dovod}`);
  }
  return telo;
};

export type VysledokNasadenia = {
  stav: "hotovo" | "chyba";
  repozitar?: string;
  adresa?: string;
  poznamka: string;
};

export async function zalozWeb(
  req: PayloadRequest,
  projekt: { id: number | string; kod: string; nazov: string; revalidateSecret?: string | null },
): Promise<VysledokNasadenia> {
  const n = nastavenieNasadenia();
  if (!n) {
    return {
      stav: "chyba",
      poznamka:
        "Automatické nasadenie nie je nastavené. Doplň premenné GITHUB_TOKEN, SABLONA_REPO a VERCEL_TOKEN.",
    };
  }

  const meno = projekt.kod;
  const tim = n.vercelTim ? `?teamId=${encodeURIComponent(n.vercelTim)}` : "";
  const kroky: string[] = [];

  try {
    // 1) Repozitár zo šablóny.
    const repo = await posli(
      `https://api.github.com/repos/${n.sablonaVlastnik}/${n.sablonaRepo}/generate`,
      {
        method: "POST",
        headers: {
          accept: "application/vnd.github+json",
          authorization: `Bearer ${n.githubToken}`,
          "content-type": "application/json",
          "x-github-api-version": "2022-11-28",
        },
        body: JSON.stringify({
          owner: n.cieloryVlastnik,
          name: meno,
          description: `Web projektu ${projekt.nazov} — obsah z ${n.hubUrl}`,
          private: true,
        }),
      },
    );
    kroky.push(`repozitár ${repo.full_name}`);

    // Tajomstvo preplachu musí poznať web aj projekt. Keď ho projekt nemá,
    // vyrobí sa tu a o kúsok nižšie sa zapíše späť.
    const tajomstvo = projekt.revalidateSecret || randomBytes(24).toString("hex");

    // 2) Projekt na Verceli napojený na ten repozitár.
    const premenne = [
      { key: "HUB_PROJEKT", value: projekt.kod },
      { key: "HUB_URL", value: n.hubUrl },
      { key: "HUB_SECRET", value: tajomstvo },
    ].map((p) => ({
      ...p,
      type: "encrypted" as const,
      target: ["production", "preview", "development"],
    }));

    const vercelProjekt = await posli(`https://api.vercel.com/v11/projects${tim}`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${n.vercelToken}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        name: meno,
        framework: "nextjs",
        gitRepository: { type: "github", repo: repo.full_name },
        environmentVariables: premenne,
      }),
    });
    kroky.push(`Vercel projekt ${vercelProjekt.name}`);

    // 3) Prvé nasadenie. Samotné napojenie repozitára ho nespustí — Vercel
    //    čaká na push, ktorý po vytvorení zo šablóny už nepríde.
    const nasadenie = await posli(`https://api.vercel.com/v13/deployments${tim}`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${n.vercelToken}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        name: meno,
        project: vercelProjekt.id,
        target: "production",
        gitSource: { type: "github", repoId: repo.id, ref: repo.default_branch || "main" },
      }),
    });
    kroky.push("nasadenie spustené");

    const adresa = nasadenie.alias?.[0] ? `https://${nasadenie.alias[0]}` : `https://${nasadenie.url}`;

    // Adresa na prepláchnutie aj tajomstvo sa dopíšu do projektu, takže web
    // je napojený obojsmerne hneď — bez toho by sa obsah menil, ale web by
    // o tom nevedel, kým by to niekto ručne nedoplnil.
    await req.payload.update({
      collection: "projekty",
      id: projekt.id,
      data: {
        revalidateSecret: tajomstvo,
        revalidateUrl: `${adresa}/api/revalidate`,
        domenaHlavna: adresa,
      },
      req,
      overrideAccess: true,
      context: { preskocKontrolu: true, preskocNasadenie: true, preskocPreplach: true },
    });

    return {
      stav: "hotovo",
      repozitar: repo.html_url,
      adresa,
      poznamka: `Hotovo: ${kroky.join(", ")}. Prvé nasadenie môže trvať pár minút.`,
    };
  } catch (chyba) {
    req.payload.logger.error({ chyba }, "Automatické nasadenie webu zlyhalo.");
    return {
      stav: "chyba",
      poznamka: [
        kroky.length ? `Podarilo sa: ${kroky.join(", ")}.` : "Nepodarilo sa nič.",
        `Zlyhalo na: ${(chyba as Error).message}`,
      ].join(" "),
    };
  }
}
