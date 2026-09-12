/**
 * Wordmark ZJAV_ — presne ten z webu: text a blikajúci azúrový podtržník
 * ako kurzor v termináli. Nie je to obrázok, je to text, takže sa
 * prispôsobí téme aj veľkosti písma a nepotrebuje druhú verziu pre tmu.
 */
export const ZjavZnacka = ({ text = "ZJAV" }: { text?: string }) => (
  <span className="zjav-znacka">
    {text}
    <span className="zjav-znacka__kurzor">_</span>
  </span>
);

/** Ikona v hlavičke bočného menu. */
export const ZjavIkona = () => (
  <span className="zjav-ikona">
    <ZjavZnacka text="Z" />
  </span>
);

/** Logo na prihlasovacej obrazovke. */
export const ZjavLogo = () => (
  <span className="zjav-logo">
    <ZjavZnacka />
    <span className="zjav-logo__podtitul">Obsahový hub</span>
  </span>
);

export default ZjavZnacka;
