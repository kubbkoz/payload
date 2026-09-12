/**
 * Obrazovka, keď web nevie, čí obsah má ťahať.
 *
 * Je to prvá vec, ktorú človek uvidí po naklonovaní šablóny, takže nemá
 * povedať „Application error", ale presne to, čo treba vyplniť. Ušetrí to
 * hľadanie v logu pri každom novom projekte.
 */
export function Nenapojene({ chyba }: { chyba: string }) {
  const projekt = process.env.HUB_PROJEKT;
  return (
    <main className="chyba">
      <p className="chyba__kod">·_·</p>
      <h1>Web zatiaľ nie je napojený na CMS</h1>
      <p>
        {projekt
          ? `Obsah pre projekt „${projekt}" sa nepodarilo načítať.`
          : "Chýba premenná HUB_PROJEKT — kód projektu z administrácie."}
      </p>
      <pre>
        {[
          "# .env.local",
          `HUB_PROJEKT=${projekt || "kod-projektu"}`,
          `HUB_URL=${process.env.HUB_URL || "https://cms.zjav.sk"}`,
          "# HUB_API_KEY=...   (len keď má projekt vypnuté verejné čítanie)",
        ].join("\n")}
      </pre>
      <p className="prazdne">
        Kód projektu nájdeš v administrácii v sekcii Systém → Projekty. Na Verceli
        patrí do Settings → Environment Variables.
      </p>
      <details>
        <summary>Čo presne zlyhalo</summary>
        <pre>{chyba}</pre>
      </details>
    </main>
  );
}
