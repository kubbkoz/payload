import type { Blok } from "@/hub/typy";
import { Tlacidla } from "./Tlacidla";

type Data = Extract<Blok, { blockType: "cta" }>;

export function Cta({ blok }: { blok: Data }) {
  return (
    <section className={`cta cta--${blok.varianta ?? "pas"}`}>
      <div className="cta__vnutro">
        <h2 className="cta__nadpis">{blok.nadpis}</h2>
        {blok.text ? <p className="cta__text">{blok.text}</p> : null}
        <Tlacidla tlacidla={blok.tlacidla} />
      </div>
    </section>
  );
}
