import type { Blok } from "@/hub/typy";

import { Cta } from "./Cta";
import { Dlazdice } from "./Dlazdice";
import { Faq } from "./Faq";
import { FormularBlok } from "./FormularBlok";
import { Galeria } from "./Galeria";
import { Hero } from "./Hero";
import { Kod } from "./Kod";
import { ObrazokBlok } from "./ObrazokBlok";
import { Oddelovac } from "./Oddelovac";
import { TextBlok } from "./TextBlok";
import { Video } from "./Video";
import { Vypis } from "./Vypis";

/**
 * Rozcestník blokov.
 *
 * Neznámy typ bloku sa ticho preskočí. Keď v hube pribudne blok, o ktorom
 * táto šablóna ešte nevie, stránka sa nerozsype — len ho nevykreslí, kým
 * niekto nedopíše komponent. To je pri systéme, kde sa CMS a weby nasadzujú
 * nezávisle, jediné rozumné správanie.
 */
export function Bloky({ bloky }: { bloky: Blok[] | null | undefined }) {
  if (!bloky?.length) return null;

  return (
    <>
      {bloky.map((blok, i) => {
        const kluc = (blok as { id?: string }).id ?? `${blok.blockType}-${i}`;
        switch (blok.blockType) {
          case "hero":
            return <Hero key={kluc} blok={blok} />;
          case "text":
            return <TextBlok key={kluc} blok={blok} />;
          case "obrazok":
            return <ObrazokBlok key={kluc} blok={blok} />;
          case "galeria":
            return <Galeria key={kluc} blok={blok} />;
          case "vypis":
            return <Vypis key={kluc} blok={blok} />;
          case "dlazdice":
            return <Dlazdice key={kluc} blok={blok} />;
          case "cta":
            return <Cta key={kluc} blok={blok} />;
          case "faq":
            return <Faq key={kluc} blok={blok} />;
          case "formular":
            return <FormularBlok key={kluc} blok={blok} />;
          case "video":
            return <Video key={kluc} blok={blok} />;
          case "kod":
            return <Kod key={kluc} blok={blok} />;
          case "oddelovac":
            return <Oddelovac key={kluc} blok={blok} />;
          default:
            return null;
        }
      })}
    </>
  );
}
