/**
 * Wordmark ZJAV_ — presne ten z webu: text a blikajúci azúrový podtržník
 * ako kurzor v termináli. Nie je to obrázok, je to text, takže sa
 * prispôsobí téme aj veľkosti písma a nepotrebuje druhú verziu pre tmu.
 */
export const ZjavZnacka = ({
  text = "ZJAV",
  dovetok,
}: {
  text?: string;
  dovetok?: string;
}) => (
  <span className="zjav-znacka">
    {text}
    <span className="zjav-znacka__kurzor">_</span>
    {dovetok ? <span className="zjav-znacka__dovetok">{dovetok}</span> : null}
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
    <ZjavZnacka dovetok="CMS" />
    <span className="zjav-logo__podtitul">Content Hub</span>
  </span>
);

export default ZjavZnacka;
