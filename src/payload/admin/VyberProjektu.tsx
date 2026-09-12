"use client";

import { useEffect, useState } from "react";

type Polozka = { id: string; nazov: string; farba?: string | null; stav?: string | null };

const COOKIE = "hub-projekt";

const precitaj = (): string => {
  if (typeof document === "undefined") return "vsetky";
  const zhoda = new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]*)`).exec(document.cookie);
  return zhoda?.[1] ? decodeURIComponent(zhoda[1]) : "vsetky";
};

/**
 * Prepínač projektu v bočnom menu.
 *
 * Zapisuje cookie a natvrdo znovu načíta stránku. Mäkké `router.refresh()` by
 * bolo elegantnejšie, ale zoznamy v Payloade si držia stav filtrov v pamäti
 * a po prepnutí projektu by chvíľu ukazovali cudzie riadky — čo je presne tá
 * sekunda, v ktorej niekto klikne na zlý záznam.
 *
 * Nie je to bezpečnostný prvok. Je to zúženie výhľadu; práva sa rozhodujú na
 * serveri a cookie na ne nemá vplyv.
 */
export const VyberProjektu = ({ projekty }: { projekty: Polozka[] }) => {
  const [zvoleny, nastav] = useState("vsetky");

  useEffect(() => {
    nastav(precitaj());
  }, []);

  if (projekty.length === 0) return null;

  const zmen = (hodnota: string) => {
    document.cookie = `${COOKIE}=${encodeURIComponent(hodnota)}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    nastav(hodnota);
    window.location.reload();
  };

  const aktivny = projekty.find((p) => p.id === zvoleny);

  return (
    <div className="hub-panel hub-prepinac">
      <label className="hub-popis" htmlFor="hub-prepinac-vyber">
        Projekt
      </label>
      <div className="hub-prepinac__riadok">
        <span
          className="hub-prepinac__bodka"
          style={{ background: aktivny?.farba || "#8a8a8a" }}
          aria-hidden="true"
        />
        <select
          id="hub-prepinac-vyber"
          className="hub-prepinac__vyber"
          value={zvoleny}
          onChange={(e) => zmen(e.target.value)}
        >
          <option value="vsetky">Všetky projekty</option>
          {projekty.map((projekt) => (
            <option key={projekt.id} value={projekt.id}>
              {projekt.nazov}
              {projekt.stav && projekt.stav !== "aktivny" ? " (neaktívny)" : ""}
            </option>
          ))}
        </select>
      </div>
      <p className="hub-prepinac__napoveda">
        {zvoleny === "vsetky"
          ? "Zoznamy ukazujú obsah všetkých projektov, ku ktorým máš prístup."
          : "Zoznamy aj nové záznamy sú zúžené na tento projekt."}
      </p>
    </div>
  );
};

export default VyberProjektu;
