"use client";

import { useTheme } from "@payloadcms/ui";

/**
 * Svetlo / tma priamo v bočnom menu.
 *
 * Payload vie prepnúť tému aj sám — je to schované v účte používateľa, tri
 * kliknutia ďaleko. Kto sedí v paneli celý deň, prepína podľa toho, či svieti
 * slnko do monitora, a tri kliknutia zakaždým nikto robiť nebude.
 *
 * Stav sa neukladá sem: `setTheme` zapíše Payloadovu predvoľbu (cookie
 * `payload-theme` a atribút na `<html>`), takže voľba prežije odhlásenie aj
 * iné zariadenie rovnako, ako keby sa prepla v účte.
 */
const IkonaSlnko = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="12" cy="12" r="4.2" />
    <path
      strokeLinecap="round"
      d="M12 2.2v2.4M12 19.4v2.4M2.2 12h2.4M19.4 12h2.4M5.1 5.1l1.7 1.7M17.2 17.2l1.7 1.7M18.9 5.1l-1.7 1.7M6.8 17.2l-1.7 1.7"
    />
  </svg>
);

const IkonaMesiac = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20.5 14.3A8.6 8.6 0 0 1 9.7 3.5a8.6 8.6 0 1 0 10.8 10.8Z"
    />
  </svg>
);

export const PrepinacTemy = () => {
  const { setTheme, theme } = useTheme();

  return (
    <div className="hub-panel">
      <span className="hub-popis">Vzhľad</span>
      <div className="hub-temy" role="group" aria-label="Svetlý alebo tmavý vzhľad">
        <button
          type="button"
          className="hub-temy__tlacidlo"
          aria-pressed={theme === "light"}
          onClick={() => setTheme("light")}
        >
          <IkonaSlnko />
          Svetlý
        </button>
        <button
          type="button"
          className="hub-temy__tlacidlo"
          aria-pressed={theme === "dark"}
          onClick={() => setTheme("dark")}
        >
          <IkonaMesiac />
          Tmavý
        </button>
      </div>
    </div>
  );
};

export default PrepinacTemy;
