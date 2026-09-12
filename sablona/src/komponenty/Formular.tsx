"use client";

import { useState } from "react";

import type { Formular as TypFormulara } from "@/hub/typy";

type Stav = "pokoj" | "odosiela" | "hotovo" | "chyba";

/**
 * Formulár z administrácie.
 *
 * Polia sa nevykresľujú natvrdo — prídu z hubu ako popis a šablóna ich len
 * poskladá. Pridanie otázky do formulára je tak zmena v paneli, nie zásah do
 * kódu, čo je celý zmysel toho, že formuláre spravuje CMS.
 *
 * Odosiela sa na vlastný endpoint /api/formular, nie priamo do hubu: API kľúč
 * tak ostáva na serveri a odpadá CORS medzi doménami.
 */
export function Formular({ formular }: { formular: TypFormulara }) {
  const [stav, nastavStav] = useState<Stav>("pokoj");
  const [chyby, nastavChyby] = useState<string[]>([]);

  const odosli = async (udalost: React.FormEvent<HTMLFormElement>) => {
    udalost.preventDefault();
    if (stav === "odosiela") return;

    const data = new FormData(udalost.currentTarget);
    const hodnoty: Record<string, unknown> = { _pasca: data.get("_pasca") ?? "" };

    for (const pole of formular.polia) {
      if (pole.typ === "zaskrtnutie" || pole.typ === "suhlas") {
        hodnoty[pole.kluc] = data.get(pole.kluc) === "on";
      } else {
        hodnoty[pole.kluc] = data.get(pole.kluc) ?? "";
      }
    }

    nastavStav("odosiela");
    nastavChyby([]);

    try {
      const odpoved = await fetch("/api/formular", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ slug: formular.slug, hodnoty }),
      });
      const telo = await odpoved.json().catch(() => ({}));

      if (odpoved.ok) {
        if (telo?.presmerovanie) {
          window.location.href = telo.presmerovanie;
          return;
        }
        nastavStav("hotovo");
        return;
      }

      nastavChyby(
        Array.isArray(telo?.chyby) && telo.chyby.length
          ? telo.chyby
          : ["Odoslanie sa nepodarilo. Skús to ešte raz, prosím."],
      );
      nastavStav("chyba");
    } catch {
      nastavChyby(["Nepodarilo sa spojiť so serverom. Skontroluj pripojenie."]);
      nastavStav("chyba");
    }
  };

  if (stav === "hotovo") {
    return (
      <p className="formular__hotovo" role="status">
        {formular.spravaPoOdoslani || "Ďakujeme, ozveme sa čo najskôr."}
      </p>
    );
  }

  return (
    <form className="formular" onSubmit={odosli} noValidate>
      {/* Pasca na roboty. Človek ju nevidí ani na ňu netrafí tabulátorom. */}
      <div className="formular__pasca" aria-hidden="true">
        <label htmlFor={`pasca-${formular.slug}`}>Toto pole nevypĺňaj</label>
        <input id={`pasca-${formular.slug}`} name="_pasca" tabIndex={-1} autoComplete="off" />
      </div>

      {formular.polia.map((pole) => {
        const id = `${formular.slug}-${pole.kluc}`;
        const spolocne = {
          id,
          name: pole.kluc,
          required: pole.povinne,
          "aria-describedby": pole.napoveda ? `${id}-napoveda` : undefined,
        };

        return (
          <div
            key={pole.kluc}
            className={
              pole.typ === "zaskrtnutie" || pole.typ === "suhlas"
                ? "formular__pole formular__pole--prepinac"
                : "formular__pole"
            }
          >
            {pole.typ === "zaskrtnutie" || pole.typ === "suhlas" ? (
              <>
                <input type="checkbox" {...spolocne} />
                <label htmlFor={id}>
                  {pole.popis}
                  {pole.povinne ? <span aria-hidden="true"> *</span> : null}
                </label>
              </>
            ) : (
              <>
                <label htmlFor={id}>
                  {pole.popis}
                  {pole.povinne ? <span aria-hidden="true"> *</span> : null}
                </label>
                {pole.typ === "textarea" ? (
                  <textarea rows={5} {...spolocne} />
                ) : pole.typ === "vyber" ? (
                  <select {...spolocne} defaultValue="">
                    <option value="" disabled>
                      Vyber…
                    </option>
                    {pole.moznosti.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={
                      pole.typ === "email"
                        ? "email"
                        : pole.typ === "tel"
                          ? "tel"
                          : pole.typ === "cislo"
                            ? "number"
                            : pole.typ === "datum"
                              ? "date"
                              : "text"
                    }
                    {...spolocne}
                  />
                )}
              </>
            )}
            {pole.napoveda ? (
              <p className="formular__napoveda" id={`${id}-napoveda`}>
                {pole.napoveda}
              </p>
            ) : null}
          </div>
        );
      })}

      {chyby.length ? (
        <ul className="formular__chyby" role="alert">
          {chyby.map((ch, i) => (
            <li key={i}>{ch}</li>
          ))}
        </ul>
      ) : null}

      <button className="tlacidlo tlacidlo--hlavne" type="submit" disabled={stav === "odosiela"}>
        {stav === "odosiela" ? "Odosielam…" : formular.textTlacidla || "Odoslať"}
      </button>
    </form>
  );
}
