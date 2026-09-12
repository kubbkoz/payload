import type { Metadata } from "next";
import { notFound, permanentRedirect, redirect } from "next/navigation";

import { stranka as nacitajStranku, zaklad } from "@/hub/klient";
import { Bloky } from "@/komponenty/bloky";

/**
 * Stránka poskladaná z blokov, načítaná podľa cesty.
 *
 * Keď stránka na danej ceste neexistuje, pozrie sa ešte do presmerovaní
 * z administrácie — to je celý zmysel toho, že sa tam evidujú. Až potom je
 * to 404. Vďaka tomu prestavba webu nezhodí adresy, ktoré má Google v indexe,
 * a redaktor to vyrieši v paneli bez nasadzovania.
 */
export async function StrankaCMS({ cesta }: { cesta: string }) {
  const data = await nacitajStranku(cesta);

  if (!data) {
    const info = await zaklad().catch(() => null);
    const presmerovanie = info?.presmerovania?.find((p) => p.zo === cesta);
    if (presmerovanie) {
      if (presmerovanie.kod === 301) permanentRedirect(presmerovanie.na);
      redirect(presmerovanie.na);
    }
    notFound();
  }

  // Stránka bez blokov je prázdny list papiera — aspoň nadpis a perex nech má.
  const maHero = data.bloky?.[0]?.blockType === "hero";

  return (
    <>
      {maHero ? null : (
        <header className="zahlavie">
          <h1>{data.nazov}</h1>
          {data.perex ? <p className="zahlavie__perex">{data.perex}</p> : null}
        </header>
      )}
      <Bloky bloky={data.bloky} />
    </>
  );
}

export async function metadataStranky(cesta: string): Promise<Metadata> {
  const data = await nacitajStranku(cesta).catch(() => null);
  if (!data) return {};
  return {
    title: data.seo.titulok ?? data.nazov,
    description: data.seo.popis ?? data.perex ?? undefined,
    openGraph: {
      title: data.seo.titulok ?? data.nazov,
      description: data.seo.popis ?? data.perex ?? undefined,
      images: data.seo.obrazok?.url ? [{ url: data.seo.obrazok.url }] : undefined,
    },
    robots: data.seo.neindexovat ? { index: false, follow: false } : undefined,
  };
}
