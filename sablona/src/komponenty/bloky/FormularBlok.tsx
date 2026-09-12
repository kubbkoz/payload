import type { Blok } from "@/hub/typy";
import { formular as nacitajFormular } from "@/hub/klient";
import { Formular } from "@/komponenty/Formular";

type Data = Extract<Blok, { blockType: "formular" }>;

export async function FormularBlok({ blok }: { blok: Data }) {
  const slug =
    typeof blok.formular === "object" && blok.formular ? blok.formular.slug : blok.formular;
  if (!slug) return null;

  const definicia = await nacitajFormular(String(slug));
  if (!definicia) return null;

  return (
    <section className="sekcia sekcia--uzka">
      {blok.nadpis ? <h2 className="sekcia__nadpis">{blok.nadpis}</h2> : null}
      {blok.text ? <p className="sekcia__uvod">{blok.text}</p> : null}
      <Formular formular={definicia} />
    </section>
  );
}
