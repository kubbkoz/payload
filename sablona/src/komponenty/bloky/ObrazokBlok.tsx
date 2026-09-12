import type { Blok } from "@/hub/typy";
import { Obrazok } from "@/komponenty/Obrazok";

type Data = Extract<Blok, { blockType: "obrazok" }>;

export function ObrazokBlok({ blok }: { blok: Data }) {
  if (!blok.obrazok) return null;
  const plna = blok.sirka === "plna";
  return (
    <figure className={plna ? "obrazok obrazok--plna" : "obrazok"}>
      <Obrazok
        obrazok={blok.obrazok}
        sirky={plna ? "100vw" : "(max-width: 760px) 100vw, 760px"}
      />
      {blok.popisok || blok.obrazok.popisok ? (
        <figcaption>{blok.popisok || blok.obrazok.popisok}</figcaption>
      ) : null}
    </figure>
  );
}
