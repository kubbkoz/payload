import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

/**
 * Preplach po zmene obsahu v hube.
 *
 * Hub po každom uložení zavolá túto adresu s hlavičkou `x-hub-secret` a telom
 * `{ kolekcia, zaznam, udalost }`. Zhodí sa značka tej jednej kolekcie —
 * zvyšok webu ostáva vyrenderovaný a návštevník nečaká na nič.
 *
 * Bez nastaveného HUB_SECRET endpoint nič nerobí. Otvorený preplach je
 * pozvánka, aby web niekto držal v permanentnom prerenderovaní.
 */
export async function POST(poziadavka: Request) {
  const tajomstvo = process.env.HUB_SECRET;

  if (!tajomstvo) {
    return NextResponse.json(
      { chyba: "Preplach nie je nastavený — chýba HUB_SECRET." },
      { status: 501 },
    );
  }

  if (poziadavka.headers.get("x-hub-secret") !== tajomstvo) {
    return NextResponse.json({ chyba: "Neplatné tajomstvo." }, { status: 401 });
  }

  const telo = (await poziadavka.json().catch(() => ({}))) as {
    kolekcia?: string;
    udalost?: string;
  };

  // Next 16 chce pri značke aj profil životnosti; "max" znamená zhodiť
  // všetko, čo tú značku nesie, bez ohľadu na to, ako je to staré.
  revalidateTag("hub", "max");
  if (telo.kolekcia) revalidateTag(`hub:${telo.kolekcia}`, "max");

  // Nastavenia, menu a presmerovania sedia v jednej odpovedi, ktorú používa
  // rozloženie — po ich zmene treba prepláchnuť aj to.
  if (["nastavenia-webu", "navigacia", "presmerovania"].includes(telo.kolekcia ?? "")) {
    revalidateTag("hub:zaklad", "max");
    revalidatePath("/", "layout");
  }

  return NextResponse.json({ ok: true, kolekcia: telo.kolekcia ?? null });
}
