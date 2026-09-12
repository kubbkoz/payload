import Link from "next/link";

import type { Blok } from "@/hub/typy";
import { Obrazok } from "@/komponenty/Obrazok";

type Data = Extract<Blok, { blockType: "dlazdice" }>;

export function Dlazdice({ blok }: { blok: Data }) {
  const polozky = blok.polozky ?? [];
  if (!polozky.length) return null;

  return (
    <section className="sekcia sekcia--siroka">
      {blok.nadpis ? <h2 className="sekcia__nadpis">{blok.nadpis}</h2> : null}
      <div className="dlazdice">
        {polozky.map((p, i) => {
          const telo = (
            <>
              {p.ikona ? (
                <div className="dlazdica__ikona">
                  <Obrazok obrazok={p.ikona} rez="nahlad" sirky="64px" />
                </div>
              ) : null}
              <h3 className="dlazdica__nadpis">{p.nadpis}</h3>
              {p.text ? <p className="dlazdica__text">{p.text}</p> : null}
            </>
          );
          return p.odkaz ? (
            <Link className="dlazdica dlazdica--odkaz" href={p.odkaz} key={i}>
              {telo}
            </Link>
          ) : (
            <div className="dlazdica" key={i}>
              {telo}
            </div>
          );
        })}
      </div>
    </section>
  );
}
