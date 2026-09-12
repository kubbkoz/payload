import { NextResponse } from "next/server";

import { odosliFormular } from "@/hub/klient";

/**
 * Prostredník medzi formulárom v prehliadači a hubom.
 *
 * Prečo nie priamo do hubu: API kľúč by musel byť v prehliadači, kde ho vidí
 * ktokoľvek, a navyše by na požiadavku dosadal CORS. Takto kľúč nikdy neopustí
 * server a prehliadač hovorí s vlastnou doménou.
 */
export async function POST(poziadavka: Request) {
  let telo: { slug?: string; hodnoty?: Record<string, unknown> };

  try {
    telo = await poziadavka.json();
  } catch {
    return NextResponse.json({ chyba: "Neplatné telo požiadavky." }, { status: 400 });
  }

  if (!telo.slug || typeof telo.hodnoty !== "object" || telo.hodnoty === null) {
    return NextResponse.json({ chyba: "Chýba formulár alebo hodnoty." }, { status: 400 });
  }

  try {
    const { stav, telo: odpoved } = await odosliFormular(telo.slug, telo.hodnoty);
    return NextResponse.json(odpoved, { status: stav });
  } catch (chyba) {
    console.error("Formulár sa nepodarilo odoslať do hubu:", chyba);
    return NextResponse.json(
      { chyba: "Odoslanie sa nepodarilo. Skús to o chvíľu znova." },
      { status: 502 },
    );
  }
}
