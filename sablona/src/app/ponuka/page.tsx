import type { Metadata } from "next";

import { katalog, kategorie } from "@/hub/klient";
import { KartaKatalogu } from "@/komponenty/Karty";

export const metadata: Metadata = { title: "Ponuka" };

type Args = { searchParams: Promise<{ kategoria?: string }> };

/**
 * Katalóg. Filtre sú obyčajné odkazy, nie stavový komponent — filtrovaná
 * ponuka sa tak dá poslať v správe a Google ju vie prejsť.
 */
export default async function Ponuka({ searchParams }: Args) {
  const { kategoria } = await searchParams;
  const [vypis, cislenik] = await Promise.all([
    katalog({ limit: 60, kategoria }),
    kategorie("katalog"),
  ]);

  const skupiny = cislenik?.docs ?? [];

  return (
    <>
      <header className="zahlavie">
        <h1>Ponuka</h1>
      </header>

      <section className="sekcia sekcia--siroka">
        {skupiny.length ? (
          <nav className="tlacidla" aria-label="Kategórie">
            <a className={`tlacidlo ${kategoria ? "tlacidlo--vedlajsie" : "tlacidlo--hlavne"}`} href="/ponuka">
              Všetko
            </a>
            {skupiny.map((k) => (
              <a
                key={k.slug}
                className={`tlacidlo ${kategoria === k.slug ? "tlacidlo--hlavne" : "tlacidlo--vedlajsie"}`}
                href={`/ponuka?kategoria=${encodeURIComponent(k.slug)}`}
              >
                {k.nazov}
              </a>
            ))}
          </nav>
        ) : null}

        {vypis?.docs?.length ? (
          <div className="karty" style={{ marginTop: "2rem" }}>
            {vypis.docs.map((p) => (
              <KartaKatalogu key={p.id} polozka={p} />
            ))}
          </div>
        ) : (
          <p className="prazdne">V tejto kategórii zatiaľ nič nie je.</p>
        )}
      </section>
    </>
  );
}
