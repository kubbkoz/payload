import Image from "next/image";

import type { Obrazok as TypObrazka } from "@/hub/typy";

/**
 * Obrázok z hubu.
 *
 * Hub posiela originál aj rezy (`nahlad`, `karta`, `mobil`). Vyberá sa ten
 * najmenší, ktorý ešte stačí na požadovanú šírku — originál je často
 * niekoľkomegová fotka z mobilu a posielať ju do karty vo výpise je
 * najrýchlejší spôsob, ako spomaliť inak rýchly web.
 */
export function Obrazok({
  obrazok,
  sirky = "100vw",
  rez,
  vyplna = false,
  priorita = false,
  trieda,
}: {
  obrazok: TypObrazka | null | undefined;
  /** Hodnota pre `sizes` — koľko miesta obrázok v rozložení naozaj zaberá. */
  sirky?: string;
  /** Vynútený rez z hubu. Bez neho sa použije originál. */
  rez?: "nahlad" | "karta" | "mobil";
  /** Obrázok vyplní rodiča (ten musí mať position: relative a rozmer). */
  vyplna?: boolean;
  priorita?: boolean;
  trieda?: string;
}) {
  if (!obrazok?.url) return null;

  const zdroj = (rez && obrazok.rezy?.[rez]) || null;
  const url = zdroj?.url ?? obrazok.url;
  const sirka = zdroj?.sirka ?? obrazok.sirka ?? 1600;
  const vyska = zdroj?.vyska ?? obrazok.vyska ?? 1200;

  if (vyplna) {
    return (
      <Image
        src={url}
        alt={obrazok.alt || ""}
        fill
        sizes={sirky}
        priority={priorita}
        className={trieda}
        style={{ objectFit: "cover" }}
      />
    );
  }

  return (
    <Image
      src={url}
      alt={obrazok.alt || ""}
      width={sirka}
      height={vyska}
      sizes={sirky}
      priority={priorita}
      className={trieda}
    />
  );
}
