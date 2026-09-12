import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { udalost } from "@/hub/klient";
import { BohatyTextBlok, textZObsahu } from "@/hub/richtext";
import { datumSk } from "@/komponenty/Karty";
import { Obrazok } from "@/komponenty/Obrazok";

type Args = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params;
  const u = await udalost(slug).catch(() => null);
  if (!u) return {};
  return {
    title: u.seo.titulok ?? u.nazov,
    description: u.seo.popis ?? u.perex ?? textZObsahu(u.popis) ?? undefined,
    robots: u.seo.neindexovat ? { index: false, follow: false } : undefined,
  };
}

export default async function Akcia({ params }: Args) {
  const { slug } = await params;
  const u = await udalost(slug);
  if (!u) notFound();

  const udaje = [
    { nazov: "Termín", hodnota: u.datum ? datumSk(u.datum) : u.terminText },
    { nazov: "Začiatok", hodnota: u.cas },
    { nazov: "Miesto", hodnota: u.miesto },
    { nazov: "Vstupné", hodnota: u.vstupne },
  ].filter((r) => r.hodnota);

  return (
    <article>
      <header className="zahlavie zahlavie--uzke">
        {u.kategoria ? <p className="zahlavie__meta">{u.kategoria.nazov}</p> : null}
        <h1>{u.nazov}</h1>
        {u.perex ? <p className="zahlavie__perex">{u.perex}</p> : null}
        {u.obrazok ? (
          <div className="zahlavie__fotka">
            <Obrazok obrazok={u.obrazok} sirky="(max-width: 760px) 100vw, 760px" vyplna priorita />
          </div>
        ) : null}
      </header>

      <section className="sekcia sekcia--uzka">
        {udaje.length ? (
          <dl className="detail__udaje" style={{ marginTop: 0, marginBottom: "2rem" }}>
            {udaje.map((r, i) => (
              <div key={i}>
                <dt>{r.nazov}</dt>
                <dd>{r.hodnota}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        <BohatyTextBlok obsah={u.popis} />

        {u.odkazNaVstupenky ? (
          <p className="tlacidla">
            <Link className="tlacidlo tlacidlo--hlavne" href={u.odkazNaVstupenky}>
              Rezervovať miesto
            </Link>
          </p>
        ) : null}
      </section>
    </article>
  );
}
