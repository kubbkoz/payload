import type { Blok } from "@/hub/typy";

type Data = Extract<Blok, { blockType: "oddelovac" }>;

export function Oddelovac({ blok }: { blok: Data }) {
  return (
    <div className={`oddelovac oddelovac--${blok.velkost ?? "stredna"}`}>
      {blok.ciara ? <hr /> : null}
    </div>
  );
}
