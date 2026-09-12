import type { Metadata } from "next";
import type { CSSProperties } from "react";

import { adresaWebu } from "@/hub/adresa";
import { chybaHubu, zaklad } from "@/hub/klient";
import type { Zaklad } from "@/hub/typy";
import { Hlavicka } from "@/komponenty/Hlavicka";
import { Nenapojene } from "@/komponenty/Nenapojene";
import { Paticka } from "@/komponenty/Paticka";
import { Suhlas } from "@/komponenty/Suhlas";

import "@/styly/web.css";

const nacitaj = async (): Promise<{ data: Zaklad | null; chyba: string | null }> => {
  const data = await zaklad();
  return { data, chyba: data ? null : chybaHubu() };
};

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await nacitaj();
  const n = data?.nastavenia;
  if (!n) return { title: "Web", robots: { index: false, follow: false } };

  return {
    metadataBase: new URL(adresaWebu()),
    title: { default: n.nazovWebu, template: `%s · ${n.nazovWebu}` },
    description: n.popisWebu ?? n.podtitul ?? undefined,
    openGraph: {
      type: "website",
      locale: "sk_SK",
      siteName: n.nazovWebu,
      title: n.nazovWebu,
      description: n.popisWebu ?? undefined,
      images: n.obrazokZdielania?.url ? [{ url: n.obrazokZdielania.url }] : undefined,
    },
    icons: n.favicon?.url ? { icon: n.favicon.url } : undefined,
    // Projekt vo výstavbe nemá čo robiť vo vyhľadávačoch, kým sa nedokončí.
    robots: data.projekt.stav === "aktivny" ? undefined : { index: false, follow: false },
  };
}

export default async function Rozlozenie({ children }: { children: React.ReactNode }) {
  const { data, chyba } = await nacitaj();

  if (!data) {
    return (
      <html lang="sk">
        <body>
          <Nenapojene chyba={chyba ?? "Hub nevrátil žiadne nastavenia."} />
        </body>
      </html>
    );
  }

  const { nastavenia, menu } = data;
  const farby = {
    ...(nastavenia.farby.hlavna ? { "--hlavna": nastavenia.farby.hlavna } : {}),
    ...(nastavenia.farby.doplnkova ? { "--doplnkova": nastavenia.farby.doplnkova } : {}),
  } as CSSProperties;

  return (
    // Farby z administrácie idú do premenných na <html>, takže prefarbenie webu
    // je zmena v paneli, nie v kóde.
    <html lang="sk" style={farby}>
      <body>
        <Hlavicka
          nastavenia={nastavenia}
          menu={menu.find((m) => m.umiestnenie === "hlavicka")}
        />
        <main className="stranka">{children}</main>
        <Paticka
          nastavenia={nastavenia}
          menu={menu.find((m) => m.umiestnenie === "paticka")}
        />
        <Suhlas
          zobrazit={nastavenia.pravne.cookieLista}
          text={nastavenia.pravne.cookieText}
          analytics={nastavenia.meranie.analytics}
          pixel={nastavenia.meranie.pixel}
        />
      </body>
    </html>
  );
}
