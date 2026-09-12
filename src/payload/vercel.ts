/**
 * Tenká vrstva nad Vercel API — toľko, koľko treba na napojenie existujúceho
 * projektu na hub.
 *
 * Zámerne to nie je klient na celé Vercel API. Sú tu štyri operácie: vypísať
 * projekty, nastaviť premenné, prečítať domény a spustiť nasadenie. Viac hub
 * na Verceli robiť nemá a každá ďalšia funkcia by bola len ďalší spôsob, ako
 * si z administrácie obsahu urobiť správcu infraštruktúry.
 */

const STROP = 15000;

export type VercelProjekt = {
  id: string;
  nazov: string;
  framework: string | null;
  domena: string | null;
  repozitar: string | null;
  /** Už napojený na tento hub? Poznáme podľa premennej HUB_PROJEKT. */
  napojenyNa: string | null;
};

export const tokenVercelu = (): string | undefined => process.env.VERCEL_TOKEN;

const tim = () =>
  process.env.VERCEL_TEAM_ID ? `teamId=${encodeURIComponent(process.env.VERCEL_TEAM_ID)}` : "";

const adresa = (cesta: string, parametre = ""): string => {
  const casti = [tim(), parametre].filter(Boolean).join("&");
  return `https://api.vercel.com${cesta}${casti ? `?${casti}` : ""}`;
};

const volaj = async (url: string, moznosti: RequestInit = {}): Promise<any> => {
  const token = tokenVercelu();
  if (!token) throw new Error("Chýba premenná VERCEL_TOKEN.");

  const odpoved = await fetch(url, {
    ...moznosti,
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
      ...(moznosti.headers ?? {}),
    },
    signal: AbortSignal.timeout(STROP),
  });

  const telo = await odpoved.json().catch(() => ({}));
  if (!odpoved.ok) {
    const dovod = telo?.error?.message || telo?.message || JSON.stringify(telo).slice(0, 200);
    throw new Error(`Vercel ${odpoved.status}: ${dovod}`);
  }
  return telo;
};

/**
 * Projekty na účte. Vlastný projekt hubu sa zo zoznamu vyhadzuje — prepísať
 * si premenné vlastnej administrácie je chyba, ktorá sa robí presne raz.
 */
export const zoznamProjektov = async (): Promise<VercelProjekt[]> => {
  const data = await volaj(adresa("/v9/projects", "limit=100"));
  const vlastny = process.env.VERCEL_PROJECT_ID;

  return (data.projects ?? [])
    .filter((p: any) => p.id !== vlastny)
    .map((p: any): VercelProjekt => {
      const alias: string[] = p.targets?.production?.alias ?? [];
      // Vlastná doména má prednosť pred pridelenou *.vercel.app.
      const vlastna = alias.find((a) => !a.endsWith(".vercel.app"));
      const napojenie = (p.env ?? []).find((e: any) => e.key === "HUB_PROJEKT");

      return {
        id: p.id,
        nazov: p.name,
        framework: p.framework ?? null,
        domena: vlastna ?? alias[0] ?? null,
        repozitar: p.link?.repo ? `${p.link.org ?? ""}/${p.link.repo}` : null,
        napojenyNa: napojenie?.value ?? null,
      };
    })
    .sort((a: VercelProjekt, b: VercelProjekt) => a.nazov.localeCompare(b.nazov, "sk"));
};

/** Premenné sa zapisujú s upsert — druhé napojenie prepíše prvé, nezdvojí ho. */
export const nastavPremenne = async (
  projektId: string,
  premenne: { key: string; value: string }[],
): Promise<void> => {
  await volaj(adresa(`/v10/projects/${projektId}/env`, "upsert=true"), {
    method: "POST",
    body: JSON.stringify(
      premenne.map((p) => ({
        ...p,
        type: "encrypted",
        target: ["production", "preview", "development"],
      })),
    ),
  });
};

export const domenyProjektu = async (projektId: string): Promise<string[]> => {
  const data = await volaj(adresa(`/v9/projects/${projektId}/domains`, "limit=50"));
  return (data.domains ?? []).map((d: any) => d.name).filter(Boolean);
};

export const detailProjektu = async (projektId: string): Promise<any> =>
  volaj(adresa(`/v9/projects/${projektId}`));

/**
 * Nové nasadenie, aby sa premenné prejavili.
 *
 * Nastavená premenná sama o sebe neurobí nič — Vercel ju vloží až do ďalšieho
 * buildu. Bez tohto kroku by napojenie vyzeralo hotovo a web by ďalej ukazoval
 * starý obsah, čo je horšie než keby zlyhalo nahlas.
 */
export const spustiNasadenie = async (projekt: any): Promise<string | null> => {
  const odkaz = projekt?.link;
  if (!odkaz?.repoId) return null;

  const nasadenie = await volaj(adresa("/v13/deployments"), {
    method: "POST",
    body: JSON.stringify({
      name: projekt.name,
      project: projekt.id,
      target: "production",
      gitSource: {
        type: odkaz.type ?? "github",
        repoId: odkaz.repoId,
        ref: odkaz.productionBranch || projekt.productionBranch || "main",
      },
    }),
  });

  return nasadenie.alias?.[0] ? `https://${nasadenie.alias[0]}` : `https://${nasadenie.url}`;
};
