import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { polozkaKatalogu } from "@/hub/klient";
import { BohatyTextBlok, textZObsahu } from "@/hub/richtext";
import { Obrazok } from "@/komponenty/Obrazok";

type Args = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params;
  const p = await polozkaKatalogu(slug).catch(() => null);
  if (!p) return {};
  return {
    title: p.seo.titulok ?? p.nazov,
    description: p.seo.popis ?? p.perex ?? textZObsahu(p.popis) ?? undefined,
    robots: p.seo.neindexovat ? { index: false, follow: false } : undefined,
  };
}

export default async function Polozka({ params }: Args) {
  const { slug } = await params;
  const p = await polozkaKatalogu(slug);
  if (!p) notFound();

  const fotky = [p.obrazok, ...p.galeria].filter(Boolean);

  return (
    <article>
      <header className="zahlavie zahlavie--uzke">
        {p.kategoria ? <p className="zahlavie__meta">{p.kategoria.nazov}</p> : null}
        <h1>{p.nazov}</h1>
        {p.perex ? <p className="zahlavie__perex">{p.perex}</p> : null}
        {p.cena ? (
          <p className="karta__cena" style={{ fontSize: "1.4rem" }}>
            {p.cena}
            {p.jednotka ? <span className="karta__jednotka"> / {p.jednotka}</span> : null}
          </p>
        ) : null}
        {!p.dostupne ? <p className="karta__znacka">Momentálne nedostupné</p> : null}
      </header>

      {fotky.length ? (
        <section className="sekcia sekcia--siroka">
          <div className="galeria galeria--mriezka">
            {fotky.map((f, i) => (
              <figure className="galeria__polozka" key={i}>
                <Obrazok obrazok={f} rez="karta" sirky="(max-width: 760px) 100vw, 420px" vyplna priorita={i === 0} />
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      <section className="sekcia sekcia--uzka">
        <BohatyTextBlok obsah={p.popis} />
        {p.vlastnosti.length ? (
          <dl className="detail__udaje">
            {p.vlastnosti.map((v, i) => (
              <div key={i}>
                <dt>{v.nazov}</dt>
                <dd>{v.hodnota}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </section>
    </article>
  );
}
