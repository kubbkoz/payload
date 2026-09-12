"use client";

import { useFormFields } from "@payloadcms/ui";

/**
 * Odkaz na živý web projektu.
 *
 * Adresa webu je v paneli na dvoch miestach — pri projekte a v zozname — a na
 * obidvoch bola doteraz obyčajný text, ktorý si musel označiť a skopírovať do
 * adresného riadka. Pri práci s viacerými webmi naraz je to zbytočné trenie,
 * a keď sa práve pozeráš, či sa zmena prejavila, robíš to desaťkrát za hodinu.
 *
 * Adresa sa berie z formulára, nie z uloženého dokumentu, takže odkaz sedí aj
 * na doméne, ktorú si práve dopísal a ešte neuložil.
 */

/** Doména sa v paneli píše raz s protokolom, raz bez. Odkaz musí fungovať vždy. */
export const naAdresu = (hodnota: unknown): string | null => {
  if (typeof hodnota !== "string" || !hodnota.trim()) return null;
  const cista = hodnota.trim();
  try {
    return new URL(cista.includes("://") ? cista : `https://${cista}`).toString();
  } catch {
    return null;
  }
};

const hostZ = (adresa: string): string => {
  try {
    return new URL(adresa).host;
  } catch {
    return adresa;
  }
};

const IkonaOdkazu = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5h6v6" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 4.5 11 13" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M18.2 14.4v4.1a1.9 1.9 0 0 1-1.9 1.9H5.5a1.9 1.9 0 0 1-1.9-1.9V7.7a1.9 1.9 0 0 1 1.9-1.9h4.1"
    />
  </svg>
);

/** Tlačidlo v bočnom paneli detailu projektu. */
export const OtvoritWeb = () => {
  const domena = useFormFields(([fields]) => fields?.domenaHlavna?.value);
  const adresa = naAdresu(domena);

  if (!adresa) {
    return (
      <p className="otvorit-web__prazdne">
        Doplň <strong>Hlavnú doménu</strong> a objaví sa tu odkaz na živý web.
      </p>
    );
  }

  return (
    <a className="otvorit-web" href={adresa} target="_blank" rel="noopener noreferrer">
      <IkonaOdkazu />
      <span>
        Otvoriť web
        <span className="otvorit-web__host">{hostZ(adresa)}</span>
      </span>
    </a>
  );
};

/**
 * Bunka v zozname projektov.
 *
 * Riadok v zozname otvára projekt, takže kliknutie na odkaz musí zastaviť
 * bublanie — inak by sa naraz otvoril web aj editácia a človek by skončil
 * v úprave dokumentu, hoci chcel len pozrieť stránku.
 */
export const BunkaDomeny = ({ cellData }: { cellData?: unknown }) => {
  const adresa = naAdresu(cellData);
  if (!adresa) return <span className="otvorit-web__ziadna">—</span>;

  return (
    <a
      className="otvorit-web__bunka"
      href={adresa}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      title="Otvoriť web v novej karte"
    >
      {hostZ(adresa)}
      <IkonaOdkazu />
    </a>
  );
};

export default OtvoritWeb;
