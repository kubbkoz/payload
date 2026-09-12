import type { Blok } from "@/hub/typy";
import { Obrazok } from "@/komponenty/Obrazok";

type Data = Extract<Blok, { blockType: "galeria" }>;

export function Galeria({ blok }: { blok: Data }) {
  const fotky = blok.fotky ?? [];
  if (!fotky.length) return null;

  return (
    <section className="sekcia sekcia--siroka">
      {blok.nadpis ? <h2 className="sekcia__nadpis">{blok.nadpis}</h2> : null}
      <div className={`galeria galeria--${blok.rozlozenie ?? "mriezka"}`}>
        {fotky.map((f, i) => (
          <figure className="galeria__polozka" key={i}>
            <Obrazok
              obrazok={f}
              rez="karta"
              sirky="(max-width: 760px) 50vw, 380px"
              vyplna
            />
            {f.popisok ? <figcaption>{f.popisok}</figcaption> : null}
          </figure>
        ))}
      </div>
    </section>
  );
}
