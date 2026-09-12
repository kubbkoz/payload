"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import type { Menu, Nastavenia, PolozkaMenu } from "@/hub/typy";

/** Kam položka menu vedie. Stránka zo systému, inak vlastná adresa. */
export const odkazPolozky = (p: PolozkaMenu): string =>
  p.typ === "stranka" ? (p.stranka?.cesta ?? "/") : (p.adresa ?? "#");

/**
 * Hlavička s logom a menu z administrácie.
 *
 * Na mobile sa menu skladá do šuflíka. Otvorený šuflík zamyká rolovanie
 * stránky pod ním — bez toho sa pod menu roluje obsah a pôsobí to ako chyba.
 */
export function Hlavicka({
  nastavenia,
  menu,
}: {
  nastavenia: Nastavenia;
  menu: Menu | undefined;
}) {
  const cesta = usePathname();
  const [otvorene, nastavOtvorene] = useState(false);

  // Prechod na inú stránku šuflík zavrie — inak ostane otvorený nad novým obsahom.
  useEffect(() => {
    nastavOtvorene(false);
  }, [cesta]);

  useEffect(() => {
    document.body.style.overflow = otvorene ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [otvorene]);

  const polozky = menu?.polozky ?? [];

  return (
    <header className="hlavicka">
      <div className="hlavicka__vnutro">
        <Link className="hlavicka__znacka" href="/">
          {nastavenia.logo?.url ? (
            // Logo býva priehľadné PNG alebo SVG; next/image by tu nič neušetril
            // a pri SVG by len pridal krok navyše.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={nastavenia.logo.url}
              alt={nastavenia.logo.alt || nastavenia.nazovWebu}
              height={40}
            />
          ) : (
            <span className="hlavicka__nazov">{nastavenia.nazovWebu}</span>
          )}
        </Link>

        <button
          type="button"
          className="hlavicka__prepinac"
          aria-expanded={otvorene}
          aria-controls="hlavne-menu"
          onClick={() => nastavOtvorene((s) => !s)}
        >
          <span className="hlavicka__prepinac-text">{otvorene ? "Zavrieť" : "Menu"}</span>
          <span className={`hlavicka__ciarky ${otvorene ? "je-otvorene" : ""}`} aria-hidden="true">
            <span />
            <span />
          </span>
        </button>

        <nav
          id="hlavne-menu"
          className={`menu ${otvorene ? "menu--otvorene" : ""}`}
          aria-label="Hlavné menu"
        >
          <ul className="menu__zoznam">
            {polozky.map((p, i) => {
              const kam = odkazPolozky(p);
              const aktivna = cesta === kam;
              const podpolozky = p.podpolozky ?? [];
              return (
                <li key={i} className={podpolozky.length ? "menu__polozka menu__polozka--skupina" : "menu__polozka"}>
                  <Link
                    href={kam}
                    className={aktivna ? "menu__odkaz je-aktivny" : "menu__odkaz"}
                    {...(p.novaKarta ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {p.text}
                  </Link>
                  {podpolozky.length ? (
                    <ul className="menu__podzoznam">
                      {podpolozky.map((pp, j) => (
                        <li key={j}>
                          <Link
                            href={odkazPolozky(pp)}
                            className="menu__odkaz menu__odkaz--pod"
                            {...(pp.novaKarta ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                          >
                            {pp.text}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              );
            })}
          </ul>

          {nastavenia.kontakt.telefon ? (
            <a className="menu__telefon" href={`tel:${nastavenia.kontakt.telefon.replace(/\s/g, "")}`}>
              {nastavenia.kontakt.telefon}
            </a>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
