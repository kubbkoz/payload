import type { Blok } from "@/hub/typy";
import { Obrazok } from "@/komponenty/Obrazok";
import { Tlacidla } from "./Tlacidla";

type Data = Extract<Blok, { blockType: "hero" }>;

/**
 * Úvodná obrazovka. Tri podoby z administrácie sú tri triedy — o tom, ako
 * presne vyzerajú, rozhoduje CSS, nie obsah.
 *
 * Fotka má `priorita`: je to najväčší prvok na prvej obrazovke a keby sa
 * načítavala lenivo, meranie rýchlosti to odnesie ako prvé.
 */
export function Hero({ blok }: { blok: Data }) {
  const varianta = blok.varianta ?? "plny";
  return (
    <section className={`hero hero--${varianta}`}>
      {blok.pozadie ? (
        <div className="hero__fotka">
          <Obrazok obrazok={blok.pozadie} sirky="100vw" vyplna priorita />
        </div>
      ) : null}
      <div className="hero__obsah">
        <h1 className="hero__nadpis">{blok.nadpis}</h1>
        {blok.podnadpis ? <p className="hero__podnadpis">{blok.podnadpis}</p> : null}
        <Tlacidla tlacidla={blok.tlacidla} />
      </div>
    </section>
  );
}
