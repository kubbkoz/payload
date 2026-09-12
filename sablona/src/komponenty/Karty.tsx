import Link from "next/link";

import type { PolozkaKatalogu, Prispevok, Udalost } from "@/hub/typy";
import { Obrazok } from "./Obrazok";

export const datumSk = (hodnota: string | null | undefined): string => {
  if (!hodnota) return "";
  const d = new Date(hodnota);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("sk-SK", { day: "numeric", month: "long", year: "numeric" });
};

export function KartaPrispevku({ prispevok }: { prispevok: Prispevok }) {
  return (
    <article className="karta">
      <Link className="karta__odkaz" href={`/blog/${prispevok.slug}`}>
        {prispevok.obrazok ? (
          <div className="karta__fotka">
            <Obrazok obrazok={prispevok.obrazok} rez="karta" sirky="(max-width: 760px) 100vw, 380px" vyplna />
          </div>
        ) : null}
        <div className="karta__telo">
          {prispevok.datum ? <p className="karta__meta">{datumSk(prispevok.datum)}</p> : null}
          <h3 className="karta__nadpis">{prispevok.nazov}</h3>
          {prispevok.perex ? <p className="karta__perex">{prispevok.perex}</p> : null}
        </div>
      </Link>
    </article>
  );
}

export function KartaKatalogu({ polozka }: { polozka: PolozkaKatalogu }) {
  return (
    <article className={polozka.dostupne ? "karta" : "karta karta--nedostupna"}>
      <Link className="karta__odkaz" href={`/ponuka/${polozka.slug}`}>
        {polozka.obrazok ? (
          <div className="karta__fotka">
            <Obrazok obrazok={polozka.obrazok} rez="karta" sirky="(max-width: 760px) 100vw, 380px" vyplna />
          </div>
        ) : null}
        <div className="karta__telo">
          <h3 className="karta__nadpis">{polozka.nazov}</h3>
          {polozka.perex ? <p className="karta__perex">{polozka.perex}</p> : null}
          {polozka.cena ? (
            <p className="karta__cena">
              {polozka.cena}
              {polozka.jednotka ? <span className="karta__jednotka"> / {polozka.jednotka}</span> : null}
            </p>
          ) : null}
          {!polozka.dostupne ? <p className="karta__znacka">Momentálne nedostupné</p> : null}
        </div>
      </Link>
    </article>
  );
}

export function KartaUdalosti({ udalost }: { udalost: Udalost }) {
  // Dátum má prednosť pred textom: keď je vyplnený, je to ten skutočný termín.
  const termin = udalost.datum ? datumSk(udalost.datum) : (udalost.terminText ?? "");
  return (
    <article className="karta">
      <Link className="karta__odkaz" href={`/udalosti/${udalost.slug}`}>
        {udalost.obrazok ? (
          <div className="karta__fotka">
            <Obrazok obrazok={udalost.obrazok} rez="karta" sirky="(max-width: 760px) 100vw, 380px" vyplna />
          </div>
        ) : null}
        <div className="karta__telo">
          {termin ? (
            <p className="karta__meta">
              {termin}
              {udalost.cas ? ` · ${udalost.cas}` : ""}
            </p>
          ) : null}
          <h3 className="karta__nadpis">{udalost.nazov}</h3>
          {udalost.perex ? <p className="karta__perex">{udalost.perex}</p> : null}
          {udalost.vstupne ? <p className="karta__cena">{udalost.vstupne}</p> : null}
        </div>
      </Link>
    </article>
  );
}
