import type { Blok } from "@/hub/typy";
import { BohatyTextBlok } from "@/hub/richtext";

type Data = Extract<Blok, { blockType: "text" }>;

export function TextBlok({ blok }: { blok: Data }) {
  return (
    <section className={`sekcia sekcia--${blok.sirka ?? "uzka"}`}>
      {blok.nadpis ? <h2 className="sekcia__nadpis">{blok.nadpis}</h2> : null}
      <BohatyTextBlok obsah={blok.obsah} />
    </section>
  );
}
