"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const KLUC = "suhlas-cookies";

/**
 * Lišta so súhlasom — a hlavne to, čo za ňou je.
 *
 * Meracie skripty sa nenačítajú, kým človek nepovie áno. Lišta, ktorá len
 * oznámi „používame cookies" a meria od prvej sekundy, nie je súhlas, je
 * ozdoba; takto je poradie správne aj z pohľadu zákona.
 *
 * Stav sedí v localStorage. Kým sa neprečíta, nevykreslí sa nič — inak by
 * lišta bliklo aj tomu, kto sa už dávno rozhodol.
 */
export function Suhlas({
  zobrazit,
  text,
  analytics,
  pixel,
}: {
  zobrazit: boolean;
  text: string | null;
  analytics: string | null;
  pixel: string | null;
}) {
  const [volba, nastavVolbu] = useState<"neviem" | "ano" | "nie">("neviem");

  useEffect(() => {
    try {
      const ulozene = window.localStorage.getItem(KLUC);
      nastavVolbu(ulozene === "ano" ? "ano" : ulozene === "nie" ? "nie" : "neviem");
    } catch {
      // Súkromné okno alebo zablokované úložisko — správame sa ako pri odmietnutí.
      nastavVolbu("nie");
    }
  }, []);

  const rozhodni = (nova: "ano" | "nie") => {
    try {
      window.localStorage.setItem(KLUC, nova);
    } catch {
      /* nevadí, platí to aspoň pre túto návštevu */
    }
    nastavVolbu(nova);
  };

  const meria = volba === "ano";

  return (
    <>
      {meria && analytics ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${analytics}`}
            strategy="afterInteractive"
          />
          <Script id="ga" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${analytics}');`}
          </Script>
        </>
      ) : null}

      {meria && pixel ? (
        <Script id="pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixel}');fbq('track','PageView');`}
        </Script>
      ) : null}

      {zobrazit && volba === "neviem" ? (
        <div className="suhlas" role="dialog" aria-label="Súhlas so spracovaním cookies">
          <p className="suhlas__text">
            {text ||
              "Na meranie návštevnosti používame cookies. Bez tvojho súhlasu nemeriame nič."}
          </p>
          <div className="suhlas__tlacidla">
            <button type="button" className="tlacidlo tlacidlo--vedlajsie" onClick={() => rozhodni("nie")}>
              Odmietnuť
            </button>
            <button type="button" className="tlacidlo tlacidlo--hlavne" onClick={() => rozhodni("ano")}>
              Súhlasím
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
