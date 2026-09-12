import type { Blok } from "@/hub/typy";

type Data = Extract<Blok, { blockType: "kod" }>;

/**
 * Vložený kód z administrácie — rezervačné widgety, mapy, prehrávače.
 *
 * Áno, je to `dangerouslySetInnerHTML`, a áno, je to zámer: bez neho sa tretí
 * widget na web nedostane. Zdroj je editor v administrácii, kam sa dostane len
 * prihlásený človek s právom upravovať obsah projektu — čo je presne tá istá
 * dôvera, akú má vývojár nad kódom webu. Pole má pri sebe v paneli aj
 * upozornenie, že kód beží návštevníkovi v prehliadači.
 */
export function Kod({ blok }: { blok: Data }) {
  if (!blok.kod?.trim()) return null;
  return (
    <section className="sekcia sekcia--siroka">
      <div className="vlozeny-kod" dangerouslySetInnerHTML={{ __html: blok.kod }} />
    </section>
  );
}
