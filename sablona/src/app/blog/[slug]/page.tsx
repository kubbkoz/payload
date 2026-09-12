import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { prispevok } from "@/hub/klient";
import { BohatyTextBlok, textZObsahu } from "@/hub/richtext";
import { Bloky } from "@/komponenty/bloky";
import { datumSk } from "@/komponenty/Karty";
import { Obrazok } from "@/komponenty/Obrazok";

type Args = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params;
  const clanok = await prispevok(slug).catch(() => null);
  if (!clanok) return {};
  const popis = clanok.seo.popis ?? clanok.perex ?? textZObsahu(clanok.obsah);
  return {
    title: clanok.seo.titulok ?? clanok.nazov,
    description: popis || undefined,
    openGraph: {
      type: "article",
      title: clanok.nazov,
      description: popis || undefined,
      publishedTime: clanok.datum ?? undefined,
      images: (clanok.seo.obrazok ?? clanok.obrazok)?.url
        ? [{ url: (clanok.seo.obrazok ?? clanok.obrazok)!.url }]
        : undefined,
    },
    robots: clanok.seo.neindexovat ? { index: false, follow: false } : undefined,
  };
}

export default async function Clanok({ params }: Args) {
  const { slug } = await params;
  const clanok = await prispevok(slug);
  if (!clanok) notFound();

  return (
    <article>
      <header className="zahlavie zahlavie--uzke">
        <p className="zahlavie__meta">
          {clanok.datum ? datumSk(clanok.datum) : null}
          {clanok.autor ? ` · ${clanok.autor}` : ""}
        </p>
        <h1>{clanok.nazov}</h1>
        {clanok.perex ? <p className="zahlavie__perex">{clanok.perex}</p> : null}
        {clanok.obrazok ? (
          <div className="zahlavie__fotka">
            <Obrazok obrazok={clanok.obrazok} sirky="(max-width: 760px) 100vw, 760px" vyplna priorita />
          </div>
        ) : null}
      </header>

      <section className="sekcia sekcia--uzka">
        <BohatyTextBlok obsah={clanok.obsah} />
      </section>

      <Bloky bloky={clanok.bloky} />
    </article>
  );
}
