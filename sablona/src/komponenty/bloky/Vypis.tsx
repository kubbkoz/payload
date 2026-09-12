import Link from "next/link";

import type { Blok } from "@/hub/typy";
import { katalog, prispevky, udalosti } from "@/hub/klient";
import { KartaKatalogu, KartaPrispevku, KartaUdalosti } from "@/komponenty/Karty";

type Data = Extract<Blok, { blockType: "vypis" }>;

/**
 * Výpis obsahu si dáta ťahá sám pri každom vykreslení.
 *
 * Redaktor teda nezostavuje zoznam ručne — vyberie zdroj a počet a blok
 * odvtedy ukazuje to najnovšie. Nový článok sa objaví na domovskej sám, bez
 * toho, aby si naň niekto spomenul.
 */
export async function Vypis({ blok }: { blok: Data }) {
  const kategoria =
    typeof blok.kategoria === "object" && blok.kategoria ? blok.kategoria.slug : undefined;
  const limit = blok.pocet ?? 6;
  const filtre = { limit, kategoria };

  const vypis =
    blok.zdroj === "katalog"
      ? await katalog(filtre)
      : blok.zdroj === "udalosti"
        ? await udalosti(filtre)
        : await prispevky(filtre);

  if (!vypis?.docs?.length) return null;

  return (
    <section className="sekcia sekcia--siroka">
      {blok.nadpis ? <h2 className="sekcia__nadpis">{blok.nadpis}</h2> : null}

      <div className={`karty karty--${blok.rozlozenie ?? "karty"}`}>
        {blok.zdroj === "katalog"
          ? (vypis.docs as never[]).map((p: any) => <KartaKatalogu key={p.id} polozka={p} />)
          : blok.zdroj === "udalosti"
            ? (vypis.docs as never[]).map((u: any) => <KartaUdalosti key={u.id} udalost={u} />)
            : (vypis.docs as never[]).map((p: any) => <KartaPrispevku key={p.id} prispevok={p} />)}
      </div>

      {blok.odkazNaVsetko ? (
        <p className="sekcia__viac">
          <Link className="tlacidlo tlacidlo--text" href={blok.odkazNaVsetko}>
            Zobraziť všetko
          </Link>
        </p>
      ) : null}
    </section>
  );
}
