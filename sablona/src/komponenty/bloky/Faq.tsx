import type { Blok } from "@/hub/typy";

type Data = Extract<Blok, { blockType: "faq" }>;

/**
 * Otázky a odpovede cez <details>. Rozbaľovanie tak funguje aj bez
 * JavaScriptu a čítačky obrazovky s tým vedia pracovať bez ďalšej práce.
 */
export function Faq({ blok }: { blok: Data }) {
  const otazky = blok.otazky ?? [];
  if (!otazky.length) return null;

  return (
    <section className="sekcia sekcia--uzka">
      {blok.nadpis ? <h2 className="sekcia__nadpis">{blok.nadpis}</h2> : null}
      <div className="faq">
        {otazky.map((o, i) => (
          <details className="faq__polozka" key={i}>
            <summary className="faq__otazka">{o.otazka}</summary>
            <div className="faq__odpoved">
              {o.odpoved.split(/\n{2,}/).map((odstavec, j) => (
                <p key={j}>{odstavec}</p>
              ))}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
