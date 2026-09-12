import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { zaklad } from "@/hub/klient";
import { BohatyTextBlok } from "@/hub/richtext";

export const metadata: Metadata = { title: "Obchodné podmienky" };

export default async function ObchodnePodmienky() {
  const data = await zaklad();
  const obsah = data?.nastavenia.pravne.obchodnePodmienky;
  if (!obsah) notFound();

  return (
    <>
      <header className="zahlavie zahlavie--uzke">
        <h1>Obchodné podmienky</h1>
      </header>
      <section className="sekcia sekcia--uzka">
        <BohatyTextBlok obsah={obsah} />
      </section>
    </>
  );
}
