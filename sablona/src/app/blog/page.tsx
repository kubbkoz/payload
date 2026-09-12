import type { Metadata } from "next";

import { prispevky } from "@/hub/klient";
import { KartaPrispevku } from "@/komponenty/Karty";

export const metadata: Metadata = {
  title: "Novinky",
  description: "Články, novinky a oznamy.",
};

type Args = { searchParams: Promise<{ strana?: string; kategoria?: string }> };

export default async function Blog({ searchParams }: Args) {
  const { strana, kategoria } = await searchParams;
  const cislo = Number(strana) > 0 ? Number(strana) : 1;
  const vypis = await prispevky({ limit: 12, strana: cislo, kategoria });

  return (
    <>
      <header className="zahlavie">
        <h1>Novinky</h1>
      </header>

      <section className="sekcia sekcia--siroka">
        {vypis?.docs?.length ? (
          <div className="karty">
            {vypis.docs.map((p) => (
              <KartaPrispevku key={p.id} prispevok={p} />
            ))}
          </div>
        ) : (
          <p className="prazdne">Zatiaľ tu nič nie je. Prvý článok pribudne čoskoro.</p>
        )}

        {vypis && vypis.stran > 1 ? (
          <nav className="strankovanie" aria-label="Stránkovanie">
            {cislo > 1 ? <a className="tlacidlo tlacidlo--vedlajsie" href={`/blog?strana=${cislo - 1}`}>Novšie</a> : null}
            {cislo < vypis.stran ? <a className="tlacidlo tlacidlo--vedlajsie" href={`/blog?strana=${cislo + 1}`}>Staršie</a> : null}
          </nav>
        ) : null}
      </section>
    </>
  );
}
