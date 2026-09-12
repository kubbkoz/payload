import type { Metadata } from "next";

import { udalosti } from "@/hub/klient";
import { KartaUdalosti } from "@/komponenty/Karty";

export const metadata: Metadata = { title: "Udalosti" };

export default async function Udalosti() {
  const vypis = await udalosti({ limit: 40 });

  return (
    <>
      <header className="zahlavie">
        <h1>Udalosti</h1>
      </header>

      <section className="sekcia sekcia--siroka">
        {vypis?.docs?.length ? (
          <div className="karty">
            {vypis.docs.map((u) => (
              <KartaUdalosti key={u.id} udalost={u} />
            ))}
          </div>
        ) : (
          <p className="prazdne">Momentálne nemáme naplánovanú žiadnu akciu.</p>
        )}
      </section>
    </>
  );
}
