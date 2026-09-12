import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { zaklad } from "@/hub/klient";
import { BohatyTextBlok } from "@/hub/richtext";

export const metadata: Metadata = { title: "Ochrana osobných údajov" };

export default async function OchranaUdajov() {
  const data = await zaklad();
  const obsah = data?.nastavenia.pravne.ochranaUdajov;
  // Kým prevádzka text nevyplní, stránka neexistuje — prázdne právne
  // oznámenie je horšie než žiadne.
  if (!obsah) notFound();

  return (
    <>
      <header className="zahlavie zahlavie--uzke">
        <h1>Ochrana osobných údajov</h1>
      </header>
      <section className="sekcia sekcia--uzka">
        <BohatyTextBlok obsah={obsah} />
      </section>
    </>
  );
}
